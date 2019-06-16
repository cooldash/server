import { Class, Enum } from 'meteor/treenity:astronomy';

import LinkSide from './link-side';
import Link from './link.type';

const Port = Class.create({
  name: 'port',
  description: 'connection receiving side port to connect to',
  fields: {
    client: {
      type: [Link],
      default: () => [],
    },
    server: {
      type: [Link],
      default: () => [],
    },
  },
  helpers: {
    addLink() {

    },
    removeLink(link) {
      ['client', 'server'].forEach(field => {
        const index = this[field].findIndex(item => item.toString() === link.toString());
        if (index >= 0)
          this.client.splice(index, 1);
      });
    },
  },
});

Port.Side = LinkSide;

const Namespaces = Enum.create({
  name: 'port-ns',
  identifiers: {
    CLIENT: 'client',
    SERVER: 'server',
  },
});

Port.NS = Namespaces;

const PortDirection = Enum.create({
  name: 'port-direction',
  identifiers: {
    IN: 'in',
    OUT: 'out',
    BOTH: 'both',
  },
});

PortDirection.default = PortDirection.BOTH;

export default Port;
