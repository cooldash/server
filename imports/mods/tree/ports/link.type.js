import { Class } from 'meteor/treenity:astronomy';
import LinkSide from './link-side';

const Link = Class.create({
  name: 'link-field',
  fields: {
    nodeID: {
      type: String,
    },
    metaID: {
      type: String,
      optional: true,
    },
    field: {
      type: String,
      optional: true,
    },
    side: {
      type: LinkSide,
      default: LinkSide.default,
    },
    param: {
      type: String,
      optional: true,
    },
  },
  helpers: {
    toString() {
      return `${this.side}://${this.nodeID}${this.metaID ? `/${this.metaID}` : ''}${this.field ? `/${this.field}` : ''}${this.param ? `?${this.param}` : ''}`;
    },
  },
});

export default Link;
