import { Match } from 'meteor/check';
import { secureMethods, securePublish } from '../../server/secure-methods';
import { bot } from './bot';
import { Message } from './models/message';

secureMethods({
  'bot.sendMessage': {
    permission: 'loggedIn',
    check: [Object],
    method({ text, image }) {
      const user = this.user();

      const message = new Message({
        text,
        image,
        userId: this.userId,
        isBot: false,
      });

      message.save();
      return bot._onMessage({
        user,
        message,
      });
    },
  },
});

securePublish({
  messages: {
    permission: 'loggedIn',
    check: [Match.Optional(Date)],
    publish(after) {
      return Message.find(
        {
          userId: this.userId,
          ...(after && { createdAt: { $gt: after } }),
        },
        { sort: { createdAt: -1 }, fields: { userId: 0 } },
      );
    },
  },
});
