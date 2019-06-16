import Link from './link.type';

const allowed = {
  'client-client': true,
  'client-server': true,
  'server-server': true,
  'server-client': false,
};

const connectPorts = (from, fromPort, to, toPort) => {
  const fromField = from[fromPort].info;
  const toField = to[toPort].info;

  // don't link in-ports, only out-ports will create link to receiving port
  if (/* fromPortType.dir === 'in' || toPortType.dir === 'out' || */!allowed[`${fromField.ns}-${toField.ns}`])
    return;

  const link = Link.fromField(to, toPort, toField.ns);

  from[fromPort][fromField.ns].push(link);
};

export default connectPorts;
