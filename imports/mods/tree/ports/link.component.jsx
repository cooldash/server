import React, { Fragment } from 'react';

import { Tag, Input } from 'antd';
import { DropTarget } from 'react-dnd';
import { NodeRepository } from '../base/repository';
import componentManager from '../../mods/form/component-manager';
import Link from './link.type';
import ItemTypes from '../ui/dnd/item-types';
import ModalNode from '../ui/ModalNode';

export class LinkComponent extends React.PureComponent {
  state = {
    visible: false,
    dropNode: null,
    node: null,
    meta: null,
    field: null,
    fieldName: '',
  };

  componentDidMount() {
    if (this.props.value) {
      const { nodeID, metaID, field } = this.props.value;

      NodeRepository.getNodeById(nodeID, false)
        .subscribe(e => e({
          added: doc => {
            this.setState({
              node: doc,
            });

            if (metaID) {
              const meta = doc.getMetaById(metaID);

              this.setState({
                meta: meta,
              });

              // Get field of meta
              if (field) {
                this.setState({
                  field: meta.getLinkByName(field),
                  fieldName: field,
                });
              }
            }
            else {
              // Get field of node if meta is null
              if (field) {
                this.setState({
                  field: doc.getLinkByName(field),
                  fieldName: field,
                });
              }
            }
          },
        }));
    }
  }

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

  onRemove = () => {
    this.setState({
      node: null,
      meta: null,
      field: null,
    });

    this.props.onChange(null);
  };

  onLink = ({ node, meta, field }) => {
    const value = this.props.value;
    const fieldName = field && field.name;
    const link = Link.fromField(meta || node, fieldName);
    link.param = value && value.param;

    this.props.onChange(link);

    this.setState({
      visible: false,
      node,
      meta,
      field,
      fieldName,
    });
  };

  onCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { dropNode, node, meta, field, fieldName, visible } = this.state;
    const { linkType, connectDropTarget } = this.props;

    return (
      <React.Fragment>
        {visible && <ModalNode
          title="Link"
          context="-edit metaselector"
          type="default"
          node={dropNode}
          visible={visible}
          excludeInternal={true}
          linkType={linkType}
          onCancel={this.onCancel}
          onLink={this.onLink}
        />}
        {connectDropTarget(
          <span>
            {node ?
              <Fragment>
                <Tag
                  onClick={this.onRemove}>{node.name}{meta && `::${meta.type()}`}{field && `::${fieldName || (field && field.name) || ''}`}
                  <Icon type="close" />
                </Tag>
                <Input
                  onChange={param => this.props.onChange({ ...this.props.value, param })}
                />
              </Fragment>
              :
              <Tag>Drop here</Tag>
            }
          </span>
        )}
      </React.Fragment>
    );
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

export const DndLinkComponent = DropTarget(ItemTypes.NODE, spec, collect)(LinkComponent);

componentManager.registerComponent('link-field', DndLinkComponent, 'edit');
