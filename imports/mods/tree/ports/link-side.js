import { Enum } from 'meteor/treenity:astronomy';

const LinkSide = Enum.create({
  name: 'link-field-side',
  identifiers: {
    CLIENT: 'client',
    SERVER: 'server',
  },
});
LinkSide.default = LinkSide.SERVER;

export default LinkSide;

