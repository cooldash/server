import React  from 'react';
import { Meteor } from "meteor/meteor";
import { promisify } from '../../../utils/promisify';
import withTracker from '../withTracker';

const createUser = promisify(Accounts.createUser, Meteor,  1);

export const withRegister = withTracker((props, onData) => {
  const doRegister = (email, password, profile ) => createUser({ email, password, profile })
    .catch(err => {
      err.code = err.reason.replace(' ', '_').toLowerCase();
      throw err;
    });
  onData({
    doRegister,
  });
});
