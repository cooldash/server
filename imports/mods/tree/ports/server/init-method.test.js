import { Meteor } from "meteor/meteor";
import { NodeCol } from '../../base/node';
import { NamedNode } from '../../../mods/types/named-node/NamedNode.meta';
import { TestService } from '../test-service/test-service';
import { NamedNodeService } from '../../../mods/types/named-node/NamedNode.service';


// if (Meteor.isClient)
//   return;

// NamedNode.ensureRoot();
Meteor.publish('tree', function () {
  return NodeCol.find();
});

Meteor.methods({
  'publishTree'() {
    NamedNode.ensureRoot();
  },
});
