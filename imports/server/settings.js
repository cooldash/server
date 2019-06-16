import { Meteor } from 'meteor/meteor';
import { isEmpty, get } from 'lodash';
import { warn, error } from '../utils/log';

Meteor.declareSetting = function (name, description, defaultValue) {
  const settings = Meteor.settings;

  if (isEmpty(settings)) {
    error('Please include settings on meteor command line with --settings <file> or METEOR_SETTINGS enveronment variable');
    process.exit(1);
  }

  let value = get(settings, name);
  if (value === undefined) {
    if (typeof defaultValue !== 'undefined') {
      value = defaultValue;
      warn(`${name} (${description}) is not set on settings, using default: ${value}`);
    } else {
      error(`Please set ${name} on Meteor settings: ${description}`);
      process.exit(1);
    }
  }

  return value;
};
