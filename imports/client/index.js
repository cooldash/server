require('meteor-client');
const { Meteor } = require('meteor/meteor');

Meteor.settings = Meteor.settings || {};

require('./react-hot-loader');
require('./main');
