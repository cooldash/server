import { Meteor } from 'meteor/meteor';
import { Class } from '../../../mods/tree/index';
import { BotAction } from './actions';
import { addType } from '../../../mods/tree';

export const Message = Class.create({
  name: 'message',
  collection: new Meteor.Collection('messages'),
  fields: {
    userId: {
      type: String,
    },
    text: {
      type: String,
      optional: true,
    },
    image: {
      type: String,
      optional: true,
    },
    action: {
      type: BotAction,
      optional: true,
    },
    isBot: {
      type: Boolean,
    },
  },
  behaviors: {
    timestamp: {},
  },
});

addType(Message);
