import React from 'react';
import { Meteor } from 'meteor/meteor';

import Roles from '../../../mods/roles';

import withTracker from '../../../ui/utils/withTracker';
import { promisify } from '../../../utils/promisify';
import { User } from '../../../utils/user.model.js';

const loginWithPassword = promisify(Meteor.loginWithPassword, Meteor, 2);

const doLogin = (email, password) => loginWithPassword(email, password)
  .catch(err => {
    err.code = err.reason.replace(' ', '_').toLowerCase();
    throw err;
  });

export const withLogin = (NotLoggedIn, options = {}) => Component => {
  const RenderLogin = props => {
    const allowed = props.loggedIn &&
      // check permission if present
      (!options.permission || Roles.userHasPermission(props.user._id, options.permission));
    return (
      allowed
        ? <Component {...props} />
        : <NotLoggedIn {...props} />
    );
  };

  return withTracker((props, onData) => {
    // loggingIn - идет процесс авторизации и
    const loggingIn = Meteor.loggingIn();
    const userId = Meteor.userId();
    const loggedIn = !loggingIn && !!userId;
    const user = loggedIn ? User.findOne(userId) : null;
    // const sub = Meteor.subscribe('account.current');
    const sub = Meteor.subscribe('roles.my');
    if (!sub.ready()) {
      return;
    }

    onData({
      // authorizing
      loggingIn,
      // already logged in
      loggedIn,
      user,
      doLogin,
    });
  })(RenderLogin);
};
