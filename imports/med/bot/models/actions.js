import { Class } from '../../../mods/tree';

export const BotAction = Class.create({
  name: 'bot.action',
  typeField: 'type',
  fields: {},
});

const Choice = Class.create({
  name: 'bot.action.choice.choice',
  fields: {
    id: String,
    value: String,
  },
});

export const ChoicesAction = BotAction.inherit({
  name: 'bot.action.choice',
  fields: {
    choices: {
      type: [Choice],
    },
  },
});

export const DateAction = BotAction.inherit({
  name: 'bot.action.dateRange',
  fields: {},
});

export const TextAction = BotAction.inherit({
  name: 'bot.action.text',
  fields: {},
});

export const ImageAction = BotAction.inherit({
  name: 'bot.action.image',
  fields: {},
});
