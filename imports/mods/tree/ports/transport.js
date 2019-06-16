import { Meteor } from 'meteor/meteor';

class Transport {
  send() {
    throw new Error('not implemented "Transport.send"');
  }

  close() {
    throw new Error('not implemented "Transport.close"');
  }
}

export class ClientTransport extends Transport {
  constructor(pm) {
    super();
    this._pm = pm;
  }

  send(msg) {
    this._pm._onMessage(msg, this);
  }

  onClose() {
    // do nothing, client transport is always active
  }
}

export class ServerTransport extends Transport {
  constructor(pm) {
    super();
    this._pm = pm;
  }

  send(msg) {
    this._pm._onMessage(msg, this);
  }
}

class ConnTransport extends Transport {
  _onClose = [];
  closed = false;

  constructor(subscriptionId, transport) {
    super();
    this.parent = transport;
    this.subscriptionId = subscriptionId;
  }

  send(msg) {
    this.parent.sendToConn(msg, this.subscriptionId);
  }

  close() {
    if (this.closed) {
      console.error('closing already closed transport', this.subscriptionId);
      return;
    }

    this.closed = true;
    this._onClose.forEach(cb => cb());
    this._onClose = [];
  }

  onClose(cb) {
    this._onClose.push(cb);
  }
}

// C-S transport to initialize on client
export class ClientServerTransport extends Transport {
  _conn = {};

  constructor(pm) {
    super();
    const self = this;
    this._pm = pm;

    // TODO: MeteorStream to Rx
    this._stream = new Meteor.Stream('msg');
    this._stream.on('msg', function (msg) {
      let transport;
      if (Meteor.isServer) {
        transport = self._conn[this.subscriptionId];
        // create transport for new connection if not yet exists
        if (!transport) {
          transport = new ConnTransport(this.subscriptionId, self);
          self._conn[this.subscriptionId] = transport;
          this.onDisconnect = subscriptionId => {
            if (!self._conn[subscriptionId])
              console.warn('OnDisconnect: connection not found');
            delete self._conn[subscriptionId];
            transport.close();
          };
        }
      } else
        transport = self;

      if (transport.closed) {
        console.error('message on closed transport', msg);
        return;
      }

      self._pm._onMessage(msg, transport);
    });
  }

  send(msg) {
    this._stream.emit('msg', msg);
  }

  sendToConn(msg, subscriptionId) {
    this._stream.emit('msg', msg, subscriptionId);
  }

  close() {
    this._stream.close();
  }

  onClose() {
    if (!Meteor.isClient)
      throw new Error('This transport should be active only on client');
  }
}
