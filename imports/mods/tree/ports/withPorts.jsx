/* @flow */
import React from 'react';
import each from 'lodash/each';
import { check, Match } from 'meteor/check';
import portManager from './port-manager';
import Link from './link.type';
import Port from './Port';
import getDisplayName from '../../ui/utils/getDisplayName';
import LinkSide from './link-side';
import { UnconnectedSocket } from './socket';

export const withPorts = options => WrappedComponent => {
  check(options, Object);

  return class PortInitHOC extends React.Component {
    static displayName = `withPorts(${getDisplayName(WrappedComponent)})`;

    sockets = [];

    constructor(props) {
      super(props);

      check(props.meta, Match.NotNull);
      this.state = { };
    }

    componentWillMount() {
      const state = {};

      const initAsLink = (meta, link, type, name) => {
        let socket;

        if (link && link.nodeID) {
          socket = portManager.connect(link);
          if (link.param) {
            socket.send(JSON.parse(link.param));
          }
        } else {
          console.warn('link is not connected', name, 'on', meta._id);
          socket = new UnconnectedSocket();
        }

        this.sockets.push(socket);
        if (type === 'socket')
          state[name] = socket;
        else if (type === 'value' || type === true) {
          socket.subscribe(msg => this.setState({ [name]: { loading: false, value: msg.data } }));
          state[name] = { loading: true, value: undefined };
        } else
          throw new Error(`unknown socket type in PortInit on ${name}: ${type}`);
      };

      const initAsPort = (meta, field, type, name, onConnect) => {
        const link = Link.fromField(meta, name);

        if ((field.ns || field.side/* XXX exterminate 'side' */) === LinkSide.SERVER) {
          // If we want this socket to be initialized on client,
          // but it is server port - we could automatically connect to it as if we had link
          initAsLink(meta, link, type, name);
        } else {
          const portSocket = portManager.listen(link, clientSocket => {
            onConnect && onConnect(clientSocket);
          }, meta[field.name].client);
          this.sockets.push(portSocket);

          if (type === 'socket')
            state[name] = portSocket;
          else if (type === 'value' || type === true) {
            portSocket.subscribe(msg => this.setState({ [name]: { loading: false, value: msg.data } }));
            state[name] = { loading: true, value: undefined };
          } else {
            throw new Error(`unknown socket type in PortInit on ${name}: ${type}`);
          }
        }

        // else  else
        //   throw new Error(`this type of port cant be initialized ${name}: ${type}, ${field.ns}`);
      };

      each(options, (_type, name) => {
        let type;
        let onConnect;

        if (typeof type === 'object') {
          type = _type.type;
          onConnect = _type.onConnect;
        } else
          type = _type;

        const { node, meta } = this.props;

        const metaType = meta.getType();
        let field = metaType.getField(name);
        let _meta;
        if (!field) {
          const nodeType = node.getType();
          field = nodeType.getField(name);

          if (!field)
            throw new Error(`${name} not found in meta ${metaType.className}`);
          else
            _meta = node;
        } else
          _meta = meta;

        // Port connection
        switch (field.type.class) {
          case Port:
            initAsPort(_meta, field, type, name, onConnect);
            break;
          case Link:
            initAsLink(_meta, _meta[name], type, name);
            break;
          default:
            throw new Error(`unknown port field type: ${field.type}`);
        }
      });

      this.setState(state);
    }

    componentWillUnmount() {
      this.sockets.forEach(s => s.close());
      this.sockets = [];
    }

    render() {
      return (<WrappedComponent
        {...this.state}
        {...this.props}
      />);
    }
  };
};

withPorts.SOCKET = 'socket';
withPorts.VALUE = 'value';
