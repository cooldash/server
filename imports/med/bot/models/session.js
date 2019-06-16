import { BotAction } from './actions';
import { Class } from '../../../mods/tree';
import { User } from '../../../utils/user.model';

export const Session = Class.create({
  name: 'session',
  fields: {
    scenario: {
      type: String,
      optional: true,
    },
    actionId: {
      type: Number,
      optional: true,
    },
    lastAction: {
      type: BotAction,
      optional: true,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
});

User.extend({
  fields: {
    session: {
      type: Session,
      default: () => new Session(),
    },
    clinic: {
      type: Object,
      default: () => ({}),
    },
  },
});
