import { Meteor } from 'meteor/meteor';
import { info } from '../utils/log';

export const restart = () => `
 **************************************
 Write something here to restart server
 **************************************
 restarting migrations
`;

if (Meteor.isDevelopment) {
  process.on('SIGHUP', () => {
    info('CLOSING [SIGHUP]');
    process.exit(0);
  });

  Meteor.methods({
    restart() {
      info('CLOSING [method restart]');
      setTimeout(() => process.exit(0), 500);
    },
  }, { unsecuredOk: true });
}
