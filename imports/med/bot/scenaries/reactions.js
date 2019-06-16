import { runScenario } from './run-scenario';

export const reactions = [
  {
    words: ['привет', 'здравствуйте', 'hi', 'хай'],
    reaction(ctx, word) {
      ctx.reply('Привет, пользователь!');
    },
  },
  {
    words: ['эй', 'чо', 'йо'],
    reaction(ctx, word) {
      ctx.command = 'choices';
      ctx.bot.emit('command', ctx);
    },
  },
  {
    words: ['запись', 'запиши', 'записаться', 'запишите', 'доктор'],
    reaction(ctx, word) {
      runScenario('schedule', ctx);
    },
  },
];
