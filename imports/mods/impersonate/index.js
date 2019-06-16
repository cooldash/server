import { Meteor } from 'meteor/meteor';
import Cookie from 'js-cookie';

import Roles, { addPermissions } from '../roles';
import { Impersonate } from 'meteor/gwendall:impersonate';

addPermissions([
  'impersonate',
  'can-impersonate-me',
]);

export const canImpersonate = (toUser, fromUser) => {
  fromUser = fromUser || Meteor.userId();

  return Roles.userHasPermission(fromUser, 'impersonate') &&
    (!toUser || Roles.userHasPermission(toUser, 'can-impersonate-me'));
};


if (Meteor.isClient) {
  // save every impersonation to cookie
  const imDo = Impersonate.do;
  Impersonate.do = function (toUser, cb) {
    console.log('Impersonating to', toUser);
    const newCb = function (err, userId) {
      if (!err)
        Cookie.set('iu', userId);
      if (cb)
        cb(err, userId);
    };
    imDo.call(Impersonate, toUser, newCb);
  };

  // impersonate if cookie exists
  const imUser = Cookie.get('iu');
  if (canImpersonate(imUser))
    Impersonate.do(imUser);
}

export { Impersonate };
