import { Meteor } from 'meteor/meteor';

import chai, { expect } from 'chai';

import { skip, take, map } from 'rxjs/operators';
import { Random } from 'meteor/random';
import range from 'lodash/range';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import '../../../utils/for-each-splice-asserter';
import { TestServiceMeta } from '../test-service/test.meta';
import { NamedNode } from '../../../mods/types/named-node/NamedNode.meta';
import { serviceManager } from '../../services/server';
import { connectPorts } from '../../../utils/test-utils';

chai.use(require('chai-as-promised'));

const toPromise = obs => new Promise((resolve, reject) => {
  obs.subscribe({
    next: resolve,
    error: reject,
  });
});

const firstMessage = (sub, n) => {
  if (n) return sub.pipe(skip(n), take(1));
  return sub.pipe(take(1));
};

const firstData = (sub, n) => toPromise(firstMessage(sub, n).pipe(map(m => m.data)));
const log = msg => msg1 => { console.log(msg, msg1); return msg1; };

const createServiceMetas = count => {
  const root = NamedNode.ensureRoot();
  const id = Random.id(3);
  return range(0, count).map(n => {
    const node = root.createChild(NamedNode, { _id: `node-${id}-${n}`, name: `node-${id}-${n}` });
    const meta = node.addMeta(new TestServiceMeta());
    meta._id = `meta-${id}-${n}`;
    node.save();
    return meta;
  });
};

describe('PortManager', function () {
  this.timeout(600000);

  before(() => {
    resetDatabase();
  });

  it('Services simple connect', async () => {
    const metas = createServiceMetas(2);

    connectPorts(metas[0], 'input', metas[1], 'output');
    connectPorts(metas[1], 'input', metas[0], 'output');

    const services = await Promise.all(metas.map(m => serviceManager.startService(m)));
    const input = services[0].props.input;

    let prom0 = firstData(input, 0);
    let prom1 = firstData(input, 1);

    prom0 = prom0.then(log(`prom0`));
    prom1 = prom1.then(log(`prom1`));

    input.send(`HELLO`);

    return Promise.all([
      expect(prom0).to.eventually.equal(`some default data in reply to 'undefined'`),
      expect(prom1).to.eventually.equal(`reply: HELLO`),
    ]);
  });

  it('Delayed service connect', async () => {
    const metas = createServiceMetas(2);

    connectPorts(metas[0], 'input2', metas[1], 'output');
    const services = await Promise.all(metas.map(m => serviceManager.startService(m)));

    return new Promise(resolve => {
      Meteor.setTimeout(() => resolve(), 3000);
    }).then(() => {
      const input = services[0].props.input2;

      let prom0 = firstData(input, 0);
      let prom1 = firstData(input, 1);

      prom0 = prom0.then(log(`prom0`));
      prom1 = prom1.then(log(`prom1`));

      input.send(`HELLO`);

      return Promise.all([
        expect(prom0).to.eventually.equal(`some default data in reply to 'undefined'`),
        expect(prom1).to.eventually.equal(`reply: HELLO`),
      ]);
    });
  });

  it('Services connect in-out', () => {
    const metas = createServiceMetas(3);

    connectPorts(metas[0], 'input', metas[1], 'output');
    connectPorts(metas[0], 'input', metas[2], 'output');

    connectPorts(metas[1], 'input', metas[0], 'output');
    connectPorts(metas[1], 'input', metas[2], 'output');

    connectPorts(metas[2], 'input', metas[0], 'output');
    connectPorts(metas[2], 'input', metas[1], 'output');

    return Promise.all(metas.map(async (m, i) => {
      const s = await serviceManager.startService(m);
      const result = [];
      const { input } = s.props;

      const prom0 = firstData(input);
      const prom1 = firstData(input, 1);
      const prom2 = firstData(input, 2);
      const prom3 = firstData(input, 3);

      prom0.then(log(`prom0 ${i}`));
      prom1.then(log(`prom1 ${i}`));
      prom2.then(log(`prom2 ${i}`));
      prom3.then(log(`prom3 ${i}`));

      input.send(`TEST ${i}`);

      switch (i) {
        case 0:
          result.push(expect(prom0).to.eventually.equal(`some default data in reply to 'undefined'`));
          result.push(expect(prom1).to.eventually.equal(`reply: TEST 0`));
          result.push(expect(prom2).to.eventually.equal(`some default data in reply to 'undefined'`));
          result.push(expect(prom3).to.eventually.equal(`reply: TEST 0`));
          break;
        case 1:
          result.push(expect(prom0).to.eventually.equal(`some default data in reply to 'undefined'`));
          result.push(expect(prom1).to.eventually.equal(`some default data in reply to 'undefined'`));
          result.push(expect(prom2).to.eventually.equal(`reply: TEST 1`));
          result.push(expect(prom3).to.eventually.equal(`reply: TEST 1`));
          break;
        case 2:
          result.push(expect(prom0).to.eventually.equal(`some default data in reply to 'undefined'`));
          result.push(expect(prom1).to.eventually.equal(`some default data in reply to 'undefined'`));
          result.push(expect(prom2).to.eventually.equal(`reply: TEST 2`));
          result.push(expect(prom3).to.eventually.equal(`reply: TEST 2`));
          break;
        default: throw new Error(`unknow value ${i}`);
      }

      if (!result.length) {
        return Promise.resolve();
      }

      return Promise.all(result);
    }));
  });

  it('Services connect autostart service', async () => {
    const metas = createServiceMetas(2);

    connectPorts(metas[0], 'input', metas[1], 'output');

    const s = await serviceManager.startService(metas[0]);

    const prom0 = firstData(s.props.input);
    const prom1 = firstData(s.props.input, 1);
    s.props.input.send(`TEST 0`);
    return Promise.all([
      expect(prom0).to.eventually.equal(`some default data in reply to 'undefined'`),
      expect(prom1).to.eventually.equal(`reply: TEST 0`),
    ]);
  });

  it('Services connect both', async () => {
    const metas = createServiceMetas(2);

    connectPorts(metas[1], 'both', metas[0], 'both');
    connectPorts(metas[0], 'both', metas[1], 'both');

    const services = await Promise.all(metas.map(m => serviceManager.startService(m)));

    return Promise.all([
      () => {
        const prom = firstData(services[1].props.both);
        services[0].props.both.send(`TEST 0`);
        return expect(prom).to.eventually.equal(`TEST 0`);
      },
      () => {
        const prom = firstData(services[0].props.both);
        services[1].props.both.send(`TEST 1`);
        return expect(prom).to.eventually.equal(`TEST 1`);
      },
    ]);
  });

  it('Stated services', async () => {
    const metas = createServiceMetas(3);

    const result = [];

    connectPorts(metas[0], 'statedInput', metas[1], 'output');

    const service0 = await serviceManager.startService(metas[0]);

    // Log output service 1
    const service1 = await serviceManager.startService(metas[1]);
    service1.props.output.subscribe(msg => console.log('service1 statedInput:', msg.data));

    const input0 = service0.props.statedInput;

    let prom0 = firstData(input0, 0);
    let prom1 = firstData(input0, 1);

    prom0 = prom0.then(log(`prom0`));
    prom1 = prom1.then(log(`prom1`));

    input0.send(`HELLO`);

    result.push(expect(prom0).to.eventually.equal(`some default data in reply to 'undefined'`));
    result.push(expect(prom1).to.eventually.equal(`reply: HELLO`));

    const value = new Promise(resolve => {
      Meteor.setTimeout(() => resolve(), 1000);
    }).then(async () => {
      connectPorts(metas[2], 'output', metas[0], 'statedInput');
      const service2 = await serviceManager.startService(metas[2]);
      const output = service2.props.output;

      let _prom0 = firstData(output, 0);

      _prom0 = _prom0.then(log(`_prom0`));

      return expect(_prom0).to.eventually.equal(`HELLO`);
    });

    result.push(value);
    return Promise.all(result);
  });
});

