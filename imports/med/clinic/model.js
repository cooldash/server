import { Meteor } from 'meteor/meteor';
import { addType, Class } from '../../mods/tree';
import { User } from '../../utils/user.model';

export const Clinic = Class.create({
  name: 'clinic',
  collection: new Meteor.Collection('clinics'),
  fields: {
    // id: {
    //   type: Number,
    // },
    name: {
      type: String,
      optional: true,
      form: {
        label: 'Name',
        attrs: {
          placeholder: 'Name',
        },
      },
    },
    description: {
      type: String,
      optional: true,
      form: {
        type: 'textarea',
        attrs: {
          type: 'textarea',
        },
      },
    },
    image: {
      type: String,
      optional: true,
    },
  },
  behaviors: {
    timestamp: {},
  },
});

addType(Clinic);

const Extra = Class.create({
  name: 'medservice.extra',
  fields: {
    name: {
      type: String,
      optional: true,
    },
    choices: {
      type: [String],
      optional: true,
    },
  },
});

export const MedService = Class.create({
  name: 'medservice',
  collection: new Meteor.Collection('medservices'),
  fields: {
    clinicId: {
      type: String,
    },
    name: {
      type: String,
    },
    extra: {
      type: [Extra],
      default: () => ([]),
    },
  },
  behaviors: {
    timestamp: {},
  },
});

addType(MedService);


User.findNew = () => {
  return User.find({
    roles: [],
    'emails.0.address': { $exists: true },
  });
};
