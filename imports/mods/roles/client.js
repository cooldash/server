import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import Roles, { allow } from './index';

const roles = new Meteor.Collection('rolesI');

const rolesReady = new Tracker.Dependency;
const sub = Meteor.subscribe('roles.my');

Tracker.autorun(() => {
  const userId = Meteor.userId();
  if (sub.ready()) {
    roles.find({}).forEach(roleInfo => {
      const role = Roles._roles[roleInfo.name] || new Roles.Role(roleInfo.name);
      roleInfo.allow.forEach(perm => role.allow(perm, allow));
      roleInfo.deny.forEach(perm => role.deny(perm, allow));
    });
    rolesReady.changed();
  }

});

const _isReady = Roles.isReady;
Roles.isReady = () => (_isReady() && (rolesReady.depend(),sub.ready()));

export default Roles;
