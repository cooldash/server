import { User } from '../../utils/user.model';
import { bot } from './bot';

bot.on('botMessage', ({ userId, action }) => {
  // save last user action
  if (action) {
    User.update(userId, { $set: { 'session.lastAction': action } });
  }
});
