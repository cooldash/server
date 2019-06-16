import each from 'lodash/each';
import { debug, warn } from '../../utils/log';
import { UnconnectedSocket } from '../ports/socket';
import Link from '../ports/link.type';
import filterFieldsByType from '../utils/filterFieldsByType';
import Port from '../ports/Port';
import Actor from '../../server/utils/actor';

export class BaseServiceComponent extends Actor {
  sockets = [];

  constructor(props) {
    super();
    this.props = props;
  }

  node() {
    return this.props.meta.node();
  }

  connectLink(link, params) {
    if (link && link.nodeID) {
      return this.props.portManager.connect(link, params);
    } else {
      console.warn('link is not connected on', this.props.meta._id);
      return new UnconnectedSocket();
    }
  }

  // connect(name, params) {
  //   const { meta } = this.props;
  //
  //   const link = Link.fromField(meta, name);
  //   return this.connectLink(link, params);
  // }
  //
  // listen(name, onConnect) {
  //   const { meta, portManager } = this.props;
  //   const link = Link.fromField(meta, name);
  //   const socket = portManager.listen(link, onConnect);
  //   const linkId = Link.toID(link);
  //   this.sockets[linkId] = socket;
  //   return socket;
  // }

  willInit({ meta, portManager }) {
    const onConnect = (socket, name) => {
      debug('Base-Service', 'onConnect to', name, socket.srcID);
    };

    const ports = filterFieldsByType(meta.getType(), Port).filter(f => f.ns === Port.NS.SERVER);
    ports.forEach(f => {
      const port = meta[f.name];
      const link = Link.fromField(meta, f.name);
      const socket = portManager.listen(link, s => onConnect(s, f.name), port.server, { stated: f.stated });
      this.props[f.name] = socket;
      this.sockets.push(socket);
    });

    const links = filterFieldsByType(meta.getType(), Link).filter(f => f.ns === Port.NS.SERVER);
    links.forEach(f => {
      const link = meta[f.name];
      const socket = this.connectLink(link, f);
      this.props[f.name] = socket;
      this.sockets.push(socket);
    });


    const status = this.props.status;
    if (status) { // can be null if service not inherit from BaseService meta
      status.subscribe(this.onCommand);
      status.send(true);
    }
  }

  didInit() {}
  // startService() {}
  // stopService() {}
  willDestroy() {}

  didDestroy() {
    each(this.sockets, s => s.close());
    this.sockets = [];
  }

  onCommand = msg => {
    switch (msg.data) {
      case 'stop':
      case 'start':
      case 'restart':
        break;
      default:
        warn('Base-Service', 'wrong command', msg.data);
    }
  }
}

const BaseService = BaseServiceComponent;

export { BaseService };
