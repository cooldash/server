import { Meteor } from 'meteor/meteor';
import './dangerously-unsecured';
import Roles, { allRoles } from './index';


function publishRoles(userId, publication) {
  const isAdmin = Roles.userHasPermission(userId, 'admin.users.w');

  const roles = isAdmin
    ? allRoles
    : Roles.getUserRoles(userId, true);

  roles.forEach(roleName => {
    const role = Roles._roles[roleName];
    if (!role)
      return;

    publication.added('rolesI', role.name, {
      name: role.name,
      allow: Object.keys(role.allowRules),
      deny: Object.keys(role.denyRules),
    });
  });
}

Meteor.publish('roles.my', function () {
  publishRoles(this.userId, this);
  return Meteor.users.find(this.userId);
});
