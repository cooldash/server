import { Meta } from '../base/meta';
import Port from '../ports/Port';

export const BaseServiceMeta = Meta.inherit({
  name: 'service',
  fields: {
    status: {
      type: Port,
      ns: Port.Side.SERVER,
      portType: Boolean,
      stated: true,
    },
  },
});
