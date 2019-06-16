import React from 'react';
import { Row, Col, Tag } from 'antd';
import { DropTarget } from 'react-dnd';

import componentManager from '../../../mods/form/component-manager';
import { NodeRepository } from '../../base/repository';
import ModalNode from '../ModalNode';
import Port from '../../ports/Port';
import Link from '../../ports/link.type';
import ItemTypes from '../dnd/item-types';
import connectPorts from '../../ports/connect-ports';
import disconnectPorts from '../../ports/disconnect-ports';

export class PortComponent extends React.PureComponent {
  state = {
    visible: false,
    dropNode: null,
    addNodes: [],
    removeNode: [],
  };

  componentDidMount() {
    if (this.props.submitFormHandler) {
      this.props.submitFormHandler(this.onSaveHandler);
    }
  }

  renderLink = (link, index) => (
    <Tag
      closable
      onClose={() => this.onUnlink(link)}
      key={`link${index}`}
    >
      {`${link}`}
    </Tag>
  );

  onDropNode = nodeID => {
    NodeRepository.getNodeById(nodeID, false)
      .subscribe(e => e({
        added: doc => {
          this.setState({
            dropNode: doc,
            visible: true,
          });
        },
      }));
  };

  onCancel = () => {
    this.setState({ visible: false });
  };

  onLink = ({ node, meta, field }) => {
    const { value } = this.props;
    const fieldName = field && field.name;
    const _meta = meta || node;
    const info = _meta[fieldName].info;
    const link = Link.fromField(_meta, fieldName, info.ns);
    link.param = value && value.param;

    value[value.info.ns].push(link);
    this.props.onChange(value);

    this.setState({ addNodes: this.state.addNodes.push([_meta, fieldName]) });

    this.setState({
      visible: false,
    });
  };

  onUnlink = link => {
    // this.props.value.removeLink(link);
    // this.setState({ removeNode: this.state.removeNode.push([_meta, fieldName]) });
  };

  onSaveHandler = (fromMeta, fromField) => {
    this.state.addNodes.forEach(([toMeta, toField]) => {
      connectPorts(fromMeta, fromMeta[fromField], toMeta, toMeta[toField]);
      toMeta.node().save();
    });

    this.state.removeNode.forEach(([toMeta, toField]) => {
      disconnectPorts(fromMeta, fromMeta[fromField], toMeta, toMeta[toField]);
      toMeta.node().save();
    });
  };

  render() {
    const { dropNode, visible } = this.state;
    const { value, connectDropTarget } = this.props;

    return (
      <React.Fragment>
        {visible && <ModalNode
          title="Link"
          context="-edit metaselector"
          type="default"
          node={dropNode}
          visible={visible}
          excludeInternal={true}
          linkType={Port}
          onCancel={this.onCancel}
          onLink={this.onLink}
        />}
        {connectDropTarget(
          <div style={{ marginBottom: -4 }}>
            <Tag style={{ background: '#fff', borderStyle: 'dashed' }}>Drop here to link</Tag>
          </div>
        )}
        <div style={{ lineHeight: '28px' }}>
          {value.client.map(this.renderLink)}
          {value.server.map(this.renderLink)}
        </div>
      </React.Fragment>);
  }
}

const spec = {
  drop(props, monitor, component) {
    const { id } = monitor.getItem();
    component.onDropNode(id);
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

export const DndPortComponent = DropTarget(ItemTypes.NODE, spec, collect)(PortComponent);

DndPortComponent.useSubmitFormHandler = true;

componentManager.registerComponent('port', DndPortComponent);
