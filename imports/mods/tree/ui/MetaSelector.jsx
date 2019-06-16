import React from 'react';
import { Col, Row, Tag, Tree } from 'antd';

export class RenderMetaSelector extends React.PureComponent {
  state = {
    node: null,
    meta: null,
    field: "",
    fields: [],
    selectedTreeItem: [this.props.node._id]
  };

  componentDidMount() {
    this.onSelectNode();
  }

  onSelectNode = () => {
    const { onSelect, node, excludeInternal } = this.props;

    this.setState({
      node: node,
      meta: null,
      field: "",
      fields: node.getFields(excludeInternal),
      selectedTreeItem: [node._id]
    });

    onSelect && onSelect(node);
  };

  onSelectMeta = (meta) => {
    const { onSelect, excludeInternal } = this.props;
    const { node } = this.state;

    this.setState({
      meta,
      field: '',
      selectedTreeItem: [meta._id],
      fields: meta.getFields(excludeInternal),
    });

    onSelect && onSelect(node, meta);
  };

  onSelectField = (field) => {
    const {onSelect} = this.props;
    const {node, meta} = this.state;

    this.setState({field: field});

    onSelect && onSelect(node, meta, field);
  };

  onSelect = (id) => {
    if (!id) {
      this.setState({field: ''});

      const {onSelect, node, meta} = this.props;
      onSelect && onSelect(node, meta);

      return;
    }

    if (this.state.node._id === id) {
      this.onSelectNode();
    }
    else {
      const meta = this.state.node.getMetaById(id);
      this.onSelectMeta(meta);
    }
  };

  renderNode = (node) => (
    <Tree.TreeNode key={node._id} title={node.name}>
      {node.meta().map(meta => this.renderMeta(meta))}
    </Tree.TreeNode>
  );

  renderMeta = (meta) => (
    <Tree.TreeNode key={meta._id} title={meta._t}/>
  );

  renderField = (key, _field) => {
    const { field } = this.state;
    return(
      <div key={key}><Tag.CheckableTag checked={field.name === _field.name} onChange={() => this.onSelectField(_field)}>{_field.name}</Tag.CheckableTag></div>
    )
  };

  render() {
    const { node } = this.props;
    const { selectedTreeItem, fields } = this.state;

    if (!node) return '';

    return (
      <div className="gutter-example">
        <Row>
          <Col className="gutter-row" span={12}>
            <h3>Node & meta</h3>
            <Tree
              showLine
              defaultExpandAll
              selectedKeys={selectedTreeItem}
              onSelect={vals => this.onSelect && vals && this.onSelect(vals[0])}
            >
              {this.renderNode(node)}
            </Tree>
          </Col>
          <Col className="gutter-row" span={12}>
            <h3>Fields</h3>
            {fields.map((field, key) => this.renderField(key, field))}
          </Col>
        </Row>
      </div>
    );
  }
}