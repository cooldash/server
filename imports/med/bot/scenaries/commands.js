import { ChoicesAction, DateAction, ImageAction } from '../models/actions';
import { runScenario } from './run-scenario';

export const commands = {
  start(ctx) {
    delete ctx.session.scenario;
    delete ctx.session.actionId;

    ctx.reply('Привет!');
    runScenario('start', ctx);
  },

  choices(ctx) {
    ctx.replyChoices('Чего изволите, мой господин?', ['Подай', 'Принеcи', 'Не мешай']);
  },

  date(ctx) {
    ctx.reply('date', new DateAction());
  },

  image(ctx) {
    ctx.reply('image', new ImageAction());
  },

  notFound(ctx) {
    runScenario('start', ctx);
  },
};
