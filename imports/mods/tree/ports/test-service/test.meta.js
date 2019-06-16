import { Meta } from '../..';
import Port from '../Port';
import { addType } from '../../base/type-db';

export const TestServiceMeta = Meta.inherit({
  name: 'test.service',
  fields: {
    input: {
      type: Port,
      dir: 'in',
      ns: Port.NS.SERVER,
    },
    output: {
      type: Port,
      dir: 'out',
      ns: Port.NS.SERVER,
    },
    both: {
      type: Port,
      ns: Port.NS.SERVER,
    },
    statedInput: {
      type: Port,
      dir: 'in',
      ns: Port.NS.SERVER,
      stated: true,
    },
    input2: {
      type: Port,
      dir: 'in',
      ns: Port.NS.SERVER,
    },
  },
});

addType(TestServiceMeta);
