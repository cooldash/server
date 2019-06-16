import { Meteor } from 'meteor/meteor';
import { debug, fatal } from '../../utils/log';
import tryLog from '../../utils/try-log';

import { BroadcastSocket, Message, MessageSocket, QueryMessageSocket, Socket, StatedBroadcastSocket } from './socket';
import { ClientServerTransport, ClientTransport, ServerTransport } from './transport';
import Link from './link.type';

// longer times for development
const SEND_TIMEOUT = (Meteor.isDevelopment ? 10 : 5) * 1000;

export class PortManager {
  ports = {};
  sockets = {};
  transports = {};
  mailbox = {};
  deferredInit = {};
  _unknownSocketHandlers = [];
  ns = null;

  constructor() {
    if (Meteor.isClient) {
      this.ns = 'client';
      this.transports = {
        client: new ClientTransport(this),
        server: new ClientServerTransport(this),
      };
    } else {
      this.ns = 'server';
      this.transports = {
        client: new ClientServerTransport(this),
        server: new ServerTransport(this),
      };
    }
  }

  onResolvePort(resolvePort) {
    this.resolvePort = resolvePort;
  }

  /**
   * Start listen for port
   * @param link
   * @param onConnect
   * @return BroadcastSocket
   */
  listen(link, onConnect, portLinks = [], params = {}) {
    const linkID = Link.toID(link);

    debug('PM', `listening ${linkID}`);

    let socket = this.ports[linkID];
    if (!socket) {
      socket = (params.stated) ? new StatedBroadcastSocket(linkID, this) : new BroadcastSocket(linkID, this);
      socket.onConnect(onConnect);
      Object.assign(socket, {
        link,
        linkID,
        socket,
      });

      // eslint-disable-next-line no-multi-assign
      this.sockets[linkID] = this.ports[linkID] = socket;

      portLinks.forEach(toLink => {
        const s = this.connect(toLink, undefined, socket.id);
        socket._addSocket(s);
      });
    }

    return socket;
  }

  onSocketReady(socket) {
    // Defer mailbox delivery so, that client could set callbacks to listen for socket messages
    Meteor.defer(() => {
      const mailbox = this.mailbox[socket.id];
      if (mailbox) {
        for (let i = 0; i < mailbox.length; i++) {
          const msg = mailbox[i];
          Meteor.clearTimeout(msg.tout);
          this._onMessage(msg.msg, msg.transport, true);
        }
        delete this.mailbox[socket.id];
      }
    });
  }

  /**
   * Connect to port with link
   */
  /* async */ connect(link, params, fromID) {
    // XXX
    const linkID = Link.toID(link);
    const transport = this.transports[link.side];
    const socket = new Socket(this);

    Object.assign(socket, {
      link,
      linkID,
      socket,
      transport,
    });
    this.sockets[socket.id] = socket;


    socket.send(params, 'connect', fromID);
    return socket;
  }

  // To subject with flatMap, and make transport.send Observable too
  sendData(srcSocketID, data, cmd, fromID) {
    const socket = this.sockets[srcSocketID];
    if (!socket)
      throw new Error(`socket not found ${srcSocketID}`);

    if (!socket.transport) {
      fatal(`Transport for socket ${srcSocketID} not found`);
      return;
    }

    const message = Message.createSimpleMessage(
      socket.seq(),
      fromID || srcSocketID,
      socket.linkID,
      data,
      cmd,
    );
    socket.transport.send(message);
  }

  closeSocket(socketID) {
    this.sendData(socketID, undefined, 'disconnect');
    delete this.sockets[socketID];
    delete this.ports[socketID];
  }

  _onMessage = Meteor.bindEnvironment((msg, transport, skipMbox) => {
    const socketID = msg.toID;

    const socket = this._getSocket(socketID);
    if (!socket || !socket.isReady())
      this.mailbox[socketID] = this.mailbox[socketID] || [];

    if (this.mailbox[socketID] && !skipMbox) {
      this.mailbox[socketID].push({
        tout: Meteor.setTimeout(
          () => {
            console.warn(`socket ${socketID} not found after ${SEND_TIMEOUT}ms`);
            if (!this.mailbox[socketID])
              throw new Error('mailbox not found');

            const index = this.mailbox[socketID].findIndex(o => o.msg.seq === msg.seq);
            this.mailbox[socketID].splice(index, 1);

            if (this.mailbox[socketID].length === 0)
              delete this.mailbox[socketID];
          },
          SEND_TIMEOUT,
        ),
        msg,
        transport,
      });
      return;
    }

    // XXX Better way?
    switch (msg.cmd) {
      case 'observe':
      case 'query':
        msg.socket = new QueryMessageSocket(msg, transport);
        break;
      default:
        msg.socket = new MessageSocket(msg, transport);
        break;
    }

    socket.socket._onMessage(msg);
  });

  _getSocket = Meteor.isClient
    // client-side get-socket
    ? socketID => this.sockets[socketID]
    // server-side get-socket
    : socketID => {
      const socket = this.sockets[socketID];
      if (socket)
        return socket;

      // parse socketID to link
      const link = Link.fromID(socketID);
      // avoid double meta init if two ports connecting same time
      const metaID = link.metaID || link.nodeID;
      if (!this.deferredInit[metaID]) {
        this.deferredInit[metaID] = true;

        Meteor.defer(() => {
          tryLog(() => this.resolvePort(link));

          delete this.deferredInit[metaID];
        });
      }
      return null;
    };
}


const portManager = new PortManager();

export default portManager;
