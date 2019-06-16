import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Accounts } from 'meteor/accounts-base';

import request from 'request-promise';

import './roles';

import { User } from '../../utils/user.model';

async function getTokenInfo(token) {
  // const data = await request({ });
  return {
    name: 'Some Somevich',
    oms: '1234567890',
  };
}

Meteor.methods({
  async loginWithToken(token) {
    const userInfo = await getTokenInfo(token);
    if (!userInfo)
      return new Meteor.Error('unauthorized');

    let user = User.findOne({ 'services.face.token': token });
    if (!user) {
      Accounts.createUser({
        username: Random.id(),
        profile: { ...userInfo, token },
      });
      user = User.findOne({ 'services.face.token': token });
    }

    this.setUserId(user._id);

    return true;
  },
});

Accounts.onCreateUser((regInfo, user) => {
  const date = new Date();

  const { token, ...profile } = regInfo.profile || {};

  user = new User({
    ...user,
    profile,
    createdAt: date,
    updatedAt: date,
    roles: [],
  });
  user.services = user.services || {};
  user.services.face = { token };

  return user.raw();
});

// Deny all client-side updates to user documents
Meteor.users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
