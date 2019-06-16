import Port from '../Port';
import { Meta } from '../../index';
import { addType } from '../../base/type-db';

export const TestClientMeta = Meta.inherit({
  name: 'test.client',
  fields: {
    input: {
      type: Port,
      dir: 'in',
    },
    output: {
      type: Port,
      dir: 'out',
      ns: 'client',
    },
    both: {
      type: Port,
    },
  },
});

export const TestClientReceiverMeta = Meta.inherit({
  name: 'test.client.receive',
  fields: {
    input: {
      type: Port,
      dir: 'in',
      ns: 'client',
    },
  },
});

addType(TestClientMeta);
addType(TestClientReceiverMeta);
