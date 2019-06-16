import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import chai, { expect } from 'chai';

import { resetDatabase } from 'meteor/xolvio:cleaner';

import { TestServiceMeta } from '../test-service/test.meta';
import portManager from '../port-manager';
import { NamedNode } from '../../../mods/types/named-node/NamedNode.meta';
import { TestClientMeta, TestClientReceiverMeta } from './client-meta.test';
import { Link, Port } from '../index';
import connectPorts from '../connect-ports';
import { waitTree, firstData } from '../../../utils/test-utils.client';


chai.use(require('chai-as-promised'));

describe('ClientPorts', function () {
  this.timeout(500000);

  before(() => {
    resetDatabase();
    return waitTree();
  });

  it('Sockets connect simple (client-server)', done => {
    const root = NamedNode.ensureRoot();
    expect(root).to.not.be.null;
    const serviceMeta = root.addMeta(new TestServiceMeta());
    const clientMeta = root.addMeta(new TestClientMeta());
    root.save();

    const link = Link.fromField(clientMeta, 'input');
    const portLink = new Link({ nodeID: root._id, metaID: serviceMeta._id, field: 'output' });
    const listen = portManager.listen(
      link,
      undefined,
      [portLink],
    );

    listen.subscribe(x => {
      console.log(`listener receive ${x}`);
      done();
    });
    // done();
  });

  it('Sockets connect get children (client-server)', done => {
    let isDone = false;
    const root = NamedNode.ensureRoot();
    root.createChild(root.getType(), { name: 'Child1' });
    root.createChild(root.getType(), { name: 'Child2' });
    root.createChild(root.getType(), { name: 'Child3' });
    expect(root).to.not.be.null;
    const clientMeta = root.addMeta(new TestClientMeta());
    root.save();

    // connectPorts(clientMeta, 'input', serviceMeta, 'output');

    const link = Link.fromField(clientMeta, 'input');
    const portLink = new Link({ nodeID: root._id, field: 'children' });
    const listen = portManager.listen(
      link,
      undefined,
      [portLink],
    );

    listen.subscribe(msg => {
      console.log(`listener receive child: `, msg.data.doc.name);

      if (!isDone) {
        done();
        isDone = true;
      }
    });

    // Send query
    listen.send({ });
  });

  it('Sockets send test (client-client)', done => {
    let isDone = false;
    const root = NamedNode.ensureRoot();
    expect(root).to.not.be.null;
    const clientMeta = root.addMeta(new TestClientMeta());
    const receiverMeta = root.addMeta(new TestClientReceiverMeta());
    root.save();

    connectPorts(receiverMeta, 'input', clientMeta, 'output');

    const link = Link.fromField(receiverMeta, 'input');
    const clientOuput = Link.fromField(clientMeta, 'output');
    const socketReceive = portManager.listen(
      clientOuput,
      undefined,
      [link],
    );

    const socketEmitter = portManager.listen(
      link,
      (...args) => console.log('onConnect', args),
      [clientOuput],
    );

    socketReceive.subscribe(msg => {
      console.log(`listener receive child: `, msg.data);

      if (!isDone) {
        done();
        isDone = true;
      }
    });

    socketEmitter.send('Client-client data');
  });

  it('Sockets connect test (client-client)', () => {
    const root = NamedNode.ensureRoot();
    expect(root).to.not.be.null;
    const clientMeta = root.addMeta(new TestClientMeta());
    root.save();

    const link = Link.fromField(clientMeta, 'output');
    const listen = portManager.listen(
      link,
      undefined,
      [],
    );

    const connect = portManager.connect(link);

    const prom = firstData(listen);
    connect.send('TEST');
    return expect(prom).to.eventually.equal('TEST');
  });
});
