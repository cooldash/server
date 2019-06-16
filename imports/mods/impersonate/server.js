import { Meteor } from 'meteor/meteor';
import { Impersonate } from 'meteor/gwendall:impersonate';
import { addRoles } from '../roles';
import { canImpersonate } from './index';
import { secureMethods } from '../../server/secure-methods';


addRoles({
  admin: {
    impersonate: true,
  },
  // 'reg-partner': {
  //   'can-impersonate-me': true,
  // },
  // partner: {
  //   'can-impersonate-me': true,
  // },
});

Impersonate.checkAuth = function (fromUser, toUser) {
  if (canImpersonate(toUser, fromUser)) {
    return true;
  }

  throw new Meteor.Error('unauthorized to impersonate');
};


secureMethods({
  whoami: {
    permission: 'DANGEROUSLY_UNSECURED_FOR_ALL',
    method() {
      return this.userId;
    },
  },
});
