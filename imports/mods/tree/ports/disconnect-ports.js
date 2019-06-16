import Link from './link.type';
// import { warn } from '../../utils/log';

const disconnectPorts = (from, fromPort, to, toPort) => {
  const fromField = from[fromPort].info;
  const toField = to[toPort].info;
  const link = Link.fromField(to, toPort, toField.ns);
  const index = from[fromPort][fromField.ns].findIndex(_link => {
    return link.nodeID === _link.nodeID &&
      link.metaID === _link.metaID &&
      link.field === _link.field;
  });

  if (index < 0) {
    console.warn('Graph', 'Link not found on disconnect ports');
    return;
  }

  from[fromPort][fromField.ns].splice(index, 1);
};

export default disconnectPorts;
