/**
 * Created by kriz on 19/01/16.
 */
import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import Fiber from 'fibers';
import { SSR } from 'meteor/meteorhacks:ssr';
import { info, error } from '../utils/log';

process.env.MAIL_URL = Meteor.declareSetting('mail.url', 'Mail url');
const fromEmail = Meteor.declareSetting('mail.from', 'From email address');
const enabled = Meteor.declareSetting('mail.enabled', 'From email address', false);

const compiled = {};
export const renderEmail = function (template, variables = {}) {
  if (!compiled[template]) {
    SSR.compileTemplate(template, Assets.getText(template));
    compiled[template] = true;
  }

  const html = SSR.render(template, variables);
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
${html}
</html>`;
};

export function sendEmailSync(options) {
  const opts = {
    ...options,
    from: fromEmail,
  };

  if (enabled && !Meteor.isDevelopment) {
    try {
      Email.send(opts);
    } catch (err) {
      error('EMAIL', err.message);
    }
  } else {
    info('EMAIL', opts);
  }
}

export function sendEmail(options) {
  (new Fiber(() => sendEmailSync(options))).run();
}

