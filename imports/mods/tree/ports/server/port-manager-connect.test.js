import chai, { expect } from 'chai';

import { first } from 'rxjs/operators';
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import faker from 'faker';


import { Link } from '../index';
import portManager from '../port-manager';

chai.use(require('chai-as-promised'));

const firstMessage = sub => sub.pipe(first()).toPromise();
const firstData = sub => firstMessage(sub).then(m => m.data);

// if (Meteor.isClient)
//   return;


describe('PortManager.sockets', function () {
  this.timeout(600000);

  it('Sockets connect', async () => {
    const link = new Link({ nodeID: 'node-id', metaID: 'meta-id', field: `test${faker.random.uuid()}` });

    const listen = portManager.listen(
      link,
      socket => console.log('onConnect', socket.linkID),
      [],
    );

    const connect = portManager.connect(link);

    let prom = firstData(listen);
    connect.send('TEST');
    await expect(prom).to.eventually.equal('TEST');

    prom = firstData(connect);
    listen.send('TEST2');
    await expect(prom).to.eventually.equal('TEST2');
  });

  it('Sockets listen then connect', async () => {
    const link = new Link({ nodeID: 'node-id', metaID: 'meta-id', field: 'test' });

    const listen = portManager.listen(
      link,
      (...args) => console.log('onConnect'),
      []
    );

    const connect = portManager.connect(link);

    const prom = firstData(listen);
    connect.send('TEST');
    return expect(prom).to.eventually.equal('TEST');
  });

  it('Sockets connect many', () => {
    const link = new Link({ nodeID: 'node-id', metaID: 'meta-id', field: 'test' });

    const listen = portManager.listen(
      link,
      (...args) => console.log('onConnect'),
      []
    );

    const connect = portManager.connect(link);
    const connect2 = portManager.connect(link);

    const prom = firstData(listen);
    const prom2 = firstData(listen);
    connect.send('TEST');
    connect2.send('TEST2');
    return Promise.all([
      expect(prom).to.eventually.equal('TEST'),
      expect(prom2).to.eventually.equal('TEST2'),
    ]);
  });

  it('Sockets connect then listen', () => {
    const link = new Link({ nodeID: 'node-id', metaID: 'meta-id', field: 'test' });

    // ///////// First CONNECT then LISTEN
    const connect = portManager.connect(link);

    const listen = portManager.listen(
      link,
      socket => expect(socket.id === Link.toID(link)),
      [],
    );

    const prom = firstData(listen);
    connect.send('TEST');
    return expect(prom).to.eventually.equal('TEST');
  });
});




