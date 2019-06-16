import { Subject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import each from 'lodash/each';
import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { warn, error } from '../../utils/log';
import { PortManager } from './port-manager';
import Link from './link.type';

import { removeObserver } from '../utils/observable-utils';

Match.Type = type => Match.Where(o => (o instanceof type));

export class Message {
  static createSimpleMessage = (seq, fromID, toID, data, cmd) => new Message(
    seq,
    undefined,
    data,
    undefined,
    toID,
    fromID,
    cmd,
  );

  constructor(seq, repSeq, data, error, toID, fromID, cmd) {
    this.seq = seq;
    this.repSeq = repSeq;
    this.data = data;
    this.error = error;
    this.toID = toID;
    this.fromID = fromID;
    this.cmd = cmd;
  }
}

export class BaseSocket extends Observable {
  // next sequence
  _seq = 0;
  _observers = [];
  _closed = false;
  _ready = false;
  _onClose = [];
  __onConnect = [];
  msg = undefined;
  data = undefined;

  constructor(id) {
    super(observer => this._addObserver(observer));
    check(id, String);
    this.id = id;
  }

  ready() {
    this._ready = true;
  }

  isReady() {
    return this._ready;
  }

  subscribe(onNext, error, complete) {
    return super.subscribe(onNext, error || this._onError, complete);
  }

  _onError = error => {
    error('BaseSocket', error);
  };

  _addObserver(observer) {
    if (!this._ready) {
      this.ready();
    }
    this._onInitObserver(observer);

    this._observers.push(observer);
    return () => {
      this._observers = removeObserver(this._observers, observer);
    };
  }

  // Overridable initialization of observable
  _onInitObserver(/* observer */) {
  }

  seq() {
    // eslint-disable-next-line no-plusplus
    return this._seq++;
  }

  init() {
    throw new Error('not implemented');
  }

  close() {
    if (this._closed) throw new Error('socket already closed');
    this._closed = true;

    this._observers.forEach(observer => {
      observer.complete();
    });

    this._onClose.forEach(cb => cb && cb());
  }

  _onConnect(id, socket) {
    this.__onConnect.forEach(cb => cb(socket));
  }

  onClose(cb) {
    this._onClose.push(cb);
  }
  onConnect(cb) {
    this.__onConnect.push(cb);
  }

  _next(msg) {
    if (!this._observers.length) {
      warn('BaseSocket', 'no observers for socket', this.id);
    }

    this._observers.forEach(observer => observer.next(msg));
  }

  _onMessage(msg) {
    this.msg = msg;
    this.value = msg.data;
    this._next(msg);
  }
}

class PortManagerSocket extends BaseSocket {
  constructor(id, pm) {
    super(id);
    check(pm, Match.Type(PortManager));
    this._pm = pm;
  }

  ready() {
    super.ready();
    this._pm.onSocketReady(this);
  }

  send(data, cmd, id) {
    this._pm.sendData(this.id, data, cmd, id);
  }

  close() {
    super.close();
    this._pm.closeSocket(this.id);
  }
}

export class BroadcastSocket extends PortManagerSocket {
  sockets = {};

  constructor(id, pm) {
    super(id, pm);
    // special self-transport for BroadcastSocket
    this.transport = {
      send: msg => this.send(msg.data, msg.cmd),
    };
  }

  _onMessage = msg => {
    if (msg.cmd === 'connect') {
      const fromID = msg.fromID;
      if (this.sockets[fromID]) { // skip adding this socket, it is already connected
        return;
      }

      this.sockets[fromID] = msg.socket;
      msg.socket.onClose(() => this._removeSocket(fromID));
      this._onConnect(this.id, msg.socket);
    } else if (msg.cmd === 'disconnect') {
      this._removeSocket(msg.fromID);
    } else {
      super._onMessage(msg);
    }
  };

  _addSocket(socket) {
    const toID = Link.toID(socket.link);
    this.sockets[toID] = socket;
    socket.onClose(() => this._removeSocket(toID));
    socket.subscribe(this._onMessage);
    this._onConnect(socket.id, socket);
  }

  _removeSocket(fromID) {
    delete this.sockets[fromID];
  }

  onConnect(cb) {
    super.onConnect(cb);
    // call cb for each socket
    each(this.sockets, cb);
  }

  send(data, cmd) {
    if (!Object.keys(this.sockets).length) {
      warn('BroadcastSocket', 'no sockets connected while send to', this.id);
    }

    each(this.sockets, s => s.send(data, cmd, this.id));
  }

  close() {
    super.close();
    each(this.sockets, s => s.close());
  }
}

export class StatedBroadcastSocket extends BroadcastSocket {
  _onConnect(id, socket) {
    super._onConnect(id, socket);

    if (this.stateData) {
      socket.send(this.stateData);
    }
  }

  send(data, cmd) {
    super.send(data, cmd);
    this.stateData = data;
  }
}

export class Socket extends PortManagerSocket {
  _queries = {};
  _lastSeq = 0;

  constructor(pm) {
    super(Random.id(), pm);
    // this._subject = new Subject();
  }

  _onMessage(msg) {
    const query = this._queries[msg.repSeq];
    if (query) {
      query(msg);
    // check if reply come for the sequence that we already got, but it is not _queries map
    // this will indicate that other side replied to already finished query
    } else if (msg.repSeq && this._lastSeq <= msg.repSeq) {
      console.error('message for unknown query received');
      return;
    } else {
      super._onMessage(msg);
    }

    this._lastSeq = msg.repSeq;
  }

  close() {
    super.close();
    // close all queries on socket close
    each(
      this._queries,
      q => q({ cmd: 'close' }),
    );
  }

  /**
   * Send packet to socket and wait on promise for result
   * @param data
   * @param timeout
   * @return {Promise<any>}
   */
  query(data, timeout = 1000) {
    // get id, that will be assigned to next message
    const seq = this._seq;
    return new Promise((res, rej) => {
      // query resolver
      const query = result => {
        // TODO maybe find better way to close
        if (result.cmd === 'close') {
          result.error = new Error('socket closed');
        }

        clearTimeout(query.tout);
        delete this._queries[seq];
        // resolve result or error
        if (result.error) {
          rej(result.error);
        } else {
          res(result);
        }
      };
      this._queries[seq] = query;

      // set timeout to check query return
      query.tout = setTimeout(() => {
        delete this._queries[seq];
        rej(new Error('timeout'));
      }, timeout);

      this.send(data, 'query');
    });
  }

  /**
   * Self subscribe to data stream from other socket
   * @return Observable
   */
  observe(data) {
    const seq = this._seq;
    const subject = new Subject();

    this._queries[seq] = result => {
      // close subscription
      if (result.cmd === 'close') {
        delete this._queries[seq];
        subject.complete();
        return;
      }

      if (result.error) {
        subject.error(result.error);
      } else {
        subject.next(result);
      }
    };

    this.send(data, 'observe');

    const observable = subject.asObservable();
    // XXX TODO on observable unsubscrive send message to stop subscription
    return observable;
  }
}

export class UnconnectedSocket {
  id = Random.id();

  throwError(error) {
    if (Meteor.isServer) {
      throw new Error(error);
    } else {
      console.log(error, this.id);
    }
  }

  // Observable.subscribe
  subscribe() {
    this.throwError('socket not connected');
  }
  query() {
    this.throwError('socket not connected');
  }
  observe() {
    this.throwError('socket not connected');
  }
  send() {
    this.throwError('socket not connected');
  }

  close() {}
}

export class MessageSocket extends BaseSocket {
  constructor(msg, transport) {
    super(msg.fromID);
    // this socket destination
    this.dstID = msg.fromID;
    // this socket source
    this.srcID = msg.toID;
    this.repSeq = msg.seq;
    this.transport = transport;
  }

  /**
   * send data back to client
   * @param data
   */
  send(data, cmd) {
    this.transport.send(new Message(
      this.seq(),
      undefined,
      data,
      undefined, // error
      this.dstID,
      this.srcID,
      cmd,
    ));
  }

  onClose(cb) {
    if (this.transport.onClose) {
      this.transport.onClose(cb);
    }
  }
}

export class QueryMessageSocket extends MessageSocket {
  /**
   * reply to client.
   * this method should be used to send data for queries and subscriptions
   * @param data
   */
  send(data) {
    this.transport.send(new Message(
      this.seq(),
      this.repSeq,
      data,
      undefined, // error
      this.dstID,
      this.srcID,
    ));
  }
}
