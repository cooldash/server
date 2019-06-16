import { Roles } from 'meteor/nicolaslopezj:roles';
import { Meteor } from 'meteor/meteor';
import { each, mapValues } from 'lodash';

let allPermissions = [];
export const allRoles = [
  'admin',
  'clinicAdmin',
  'doctor',
];

export function allow() { return true; }

export function userOwn(user) { return this.userId === user._id; }

export function addPermissions(permissions) {
  allPermissions = allPermissions.concat(permissions);
  return permissions;
}

export function checkPermissionDefined(permission) {
  if (!allPermissions.includes(permission))
    throw new Error(`Permission not found: ${permission}`, permission);
}

export function addRoles(rolesInfo) {
  const roles = mapValues(rolesInfo, (permissions, roleName) => {
    if (!allRoles.includes(roleName) && !Roles._specialRoles.includes(roleName)) {
      throw new Error(`Role not found: ${roleName}`, roleName);
    }
    const role = Roles._roles[roleName] || new Roles.Role(roleName);
    each(permissions, (active, permission) => {
      checkPermissionDefined(permission);

      if (typeof active === 'function')
        role.allow(permission, active);
      else if (active)
        role.allow(permission, allow);
    });
    return role;
  });

  return roles;
}


Roles.hasPermission = function(permission, ...extra) {
  if (!allPermissions.includes(permission))
    throw new Error(`Permission not found: ${permission}`, permission);

  return this.userHasPermission(Meteor.userId(), permission, ...extra);
};

Roles.checkThrow = function(permission, ...extra) {
  if (!allPermissions.includes(permission))
    throw new Error(`Permission not found: ${permission}`, permission);

  return this.checkPermission(Meteor.userId(), permission, ...extra);
};

export default Roles;
