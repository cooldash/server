import React from 'react';
import { Modal } from 'antd';
import renderMeta from './render-meta';
import ContextProvider from '../base/meta-context';

export default class ModalNode extends React.Component {
  render() {
    const {
      visible,
      title,
      context,
      afterClose,
      onCancel,
      type,
      closable,
      meta,
      node
    } = this.props;

    let _meta;
    let _node;

    if (!meta && !node)
      return ('');

    if (meta) {
      if (meta.node && meta.node()) {
        _node = meta.node();
        _meta = meta;
      } else {
        _node = meta || node;
        _meta = meta || node;
      }
    } else
      _node = node;

    return (
      <Modal
        title={title}
        visible={visible}
        footer={null}
        afterClose={afterClose}
        onCancel={onCancel}
        closable={closable}
        maskClosable={closable}
      >
        {context ?
          <ContextProvider name="modal" context={context}>
            {_context => {
              return renderMeta({ meta: _meta, node: _node, type, context: _context, ...this.props });
            }}
          </ContextProvider>
          :
          renderMeta({ meta: _meta, node: _node, type, ...this.props })
        }
      </Modal>
    );
  }
}
