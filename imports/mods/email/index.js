import { Meteor } from 'meteor/meteor';
import { sendEmail } from '../../server/email';
import { warn } from '../../utils/log';
import { User } from '../../utils/user.model';


export function sendEmailToRoles(roles, subject, url) {
  const users = User.find({ roles: { $in: roles } }, { fields: { emails: 1 } }).fetch();
  const emails = users.map(u => u.emails[0].address);
  if (!emails.length) {
    warn('EMAIL', 'no users with role', roles, 'found to send email');
    return;
  }

  const text = url ? `${subject}\n${Meteor.absoluteUrl(url)}` : subject;
  sendEmail({
    subject,
    text,
    bcc: emails,
  });
}

// send email to partner
export function sendEmailToPartner(partnerID, subject, url) {
  const partner = User.findOne({ 'agent.partnerID': partnerID }, { fields: { emails: 1 } });
  if (!partner) {
    warn('EMAIL', 'partner not found', partnerID);
    return;
  }
  const text = url ? `${subject}\n${Meteor.absoluteUrl(url)}` : subject;
  const to = partner.emails[0].address;
  sendEmail({
    subject,
    text,
    to,
  });
}
