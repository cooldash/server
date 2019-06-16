import { Match } from 'meteor/check';

import { secureMethods, securePublish } from '../../server/secure-methods';
import { User } from '../../utils/user.model';

import { Message } from './models/message';
import { ChoicesAction, DateAction } from './models/actions';

const { EventEmitter } = require('events');

class Bot extends EventEmitter {
  sendMessage = (user, text, action) => {
    const userId = user._id;
    Message.insert({
      isBot: true,
      userId,
      text,
      action,
    });
    this.emit('botMessage', { userId, text, action });
  };

  sendChoices = (user, text, choices) => {
    if (typeof choices[0] === 'string')
      choices = choices.map(w => ({ id: w, value: w }));


    user.session.data.choices = choices;
    this.sendMessage(user, text, new ChoicesAction({ choices }));
  };

  sendDate = (user, text) => {
    this.sendMessage(user, text, new DateAction());
  };

  async _onMessage(ctx) {
    const { message, user } = ctx;
    ctx.reply = this.sendMessage.bind(null, user);
    ctx.replyChoices = this.sendChoices.bind(null, user);
    ctx.replyDate = this.sendDate.bind(null, user);
    ctx.bot = this;
    ctx.session = user.session;

    if (message.image)
      await this.emit('image', ctx);
    else if (message.voice)
      await this.emit('voice', ctx);
    else if (message.text.startsWith('/')) {
      ctx.command = message.text.split(' ')[0].substr(1);
      await this.emit('command', ctx);
    } else
      await this.emit('message', ctx);

    user.save();
  }
}

export const bot = new Bot();

