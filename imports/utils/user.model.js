import { Meteor } from 'meteor/meteor';
import { Class } from '../mods/tree';

const MeteorEmail = Class.create({
  name: 'metero.email',
  fields: {
    address: String,
    verified: Boolean,
  },
});

export const User = Class.create({
  name: 'user',
  collection: Meteor.users,
  permission: 'admin.users.r',
  fields: {
    emails: {
      type: [MeteorEmail],
    },
    services: {
      type: Object,
      permission: 'admin.users.w',
    },
    roles: {
      type: [String],
    },
  },
  behaviors: {
    timestamp: {},
  },
});
