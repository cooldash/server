import { Random } from 'meteor/random';
import connectPortsNoSave from '../tree/ports/connect-ports';
import { NamedNode } from '../mods/types/named-node/NamedNode.meta';

export const connectPorts = (f, f1, t, t1) => {
  connectPortsNoSave(f, f1, t, t1);
  f.node().save();
  t.node().save();
};


let metaIndex = -1;
export const createMeta = (metaInstance) => {
  metaIndex++;
  const root = NamedNode.ensureRoot();
  const id = Random.id(3);
  const node = root.createChild(NamedNode, { _id: `node-${id}-${metaIndex}`, name: `node-${id}-${metaIndex}` });
  const meta = node.addMeta(metaInstance);
  meta._id = `meta-${id}-${metaIndex}`;
  node.save();
  return meta;
};
