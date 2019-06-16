import Roles, { addPermissions, addRoles } from './index';
import { warn } from '../../utils/log';

const DANGEROUSLY_UNSECURED_FOR_ALL = 'DANGEROUSLY_UNSECURED_FOR_ALL';

addPermissions([
  DANGEROUSLY_UNSECURED_FOR_ALL,
]);
// XXX XXX XXX REMOVE THIS
addRoles({
  __loggedIn__: {
    [DANGEROUSLY_UNSECURED_FOR_ALL]: true,
  },
});

const userHasPermission = Roles.userHasPermission;
Roles.userHasPermission = function (userId, action, info = '') {
  if (action === DANGEROUSLY_UNSECURED_FOR_ALL) {
    warn('SECURITY', `${DANGEROUSLY_UNSECURED_FOR_ALL} checked`, info);
  }

  return userHasPermission.call(this, userId, action);
};
