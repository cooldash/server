import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { each, mapValues } from 'lodash';
import { User } from '../utils/user.model';

import { error } from '../utils/log';

import Roles, { checkPermissionDefined } from '../mods/roles';

function user () {
  if (!this.userId) {
    return null;
  }

  if (!this._user) {
    this._user = User.findOne(this.userId);
  }

  return this._user;
}

const checkLogPermission = (type, method, userId, permission) => {
  if (process.env.NODE_ENV === 'production') {
    Roles.checkPermission(userId, permission, { type, method });
  } else { // error on permissiong checking for dev env
    try {
      if (!userId) {
        throw new Meteor.Error('unauthorized', 'User not logged in');
      }

      Roles.checkPermission(userId, permission);
    } catch (err) {
      error('SECURE', `in ${type} ${method}, with ${permission}`, err);
      throw err;
    }
  }
};

const originalMethods = Meteor.methods;
export function secureMethods(methodDescs) {
  const methods = mapValues(methodDescs, (desc, methodName) => {
    const { permission, method, args: checkDesc } = desc;

    check(permission, String);
    checkPermissionDefined(permission);
    check(method, Function);

    return function (...args) {
      checkLogPermission('method', methodName, this.userId, permission);
      // check args if checker exists
      if (checkDesc) {
        checkDesc.forEach((c, i) => check(args[i], c));
      }

      this.user = user;

      try {
        return method.apply(this, args);
      } catch (err) {
        error('METHOD', methodName, err);
        throw err;
      }
    };
  });
  originalMethods.call(Meteor, methods);
}

const originalPublish = Meteor.publish;
export function securePublish(publishDescs) {
  each(publishDescs, (desc, name) => {
    const { permission, publish, args: checkDesc } = desc;

    check(permission, String, 'permission not string');
    checkPermissionDefined(permission);
    check(publish, Function);

    originalPublish.call(Meteor, name, function (...args) {
      checkLogPermission('publish', name, this.userId, permission);
      // check args if checker exists
      if (checkDesc) {
        checkDesc.forEach((c, i) => check(args[i], c));
      }

      this.user = user;
      return publish.apply(this, args);
    });
  });
}

// substitute original meteor methods to know who is publishing and added unsecure methods.
Meteor.publish = function (name, ...args) {
  console.error('!!! Unsecured publish', name, 'please use securePublish');
  return originalPublish.call(Meteor, name, ...args);
};

Meteor.methods = function (methods, opts) {
  if (!opts || !opts.unsecuredOk) {
    console.error('!!! Unsecured methods', Object.keys(methods), 'please use securePublish');
  }
  return originalMethods.call(Meteor, methods);
};

