import { NodeCol } from '../base/node';

Meteor.publish('tree', function () {
  return NodeCol.find();
});
