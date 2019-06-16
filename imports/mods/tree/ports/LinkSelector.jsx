import React from 'react';
import { Button } from 'antd';

import { addComponent } from '../base/type-db';
import { RenderMetaSelector } from '../ui/MetaSelector';

class RenderLinkSelector extends React.PureComponent {
  state = { disabled: true };
  params = {};

  onSelect = (node, meta, field) => {
    const { linkType } = this.props;

    this.params = { node, meta, field };

    if (field) {
      if (field.type.class) {
        this.setState({ disabled: !(linkType === field.type.class) });
        return;
      }

      this.setState({ disabled: !(linkType === field.type) });
      return;
    }

    if (meta) {
      this.setState({ disabled: !(meta instanceof linkType) });
      return;
    }

    this.setState({ disabled: !(node instanceof linkType) });
  };

  render() {
    const { node, excludeInternal, onLink } = this.props;
    const { disabled } = this.state;

    return (
      <React.Fragment>
        <RenderMetaSelector
          excludeInternal={excludeInternal}
          node={node}
          onSelect={this.onSelect}
        />
        <div className="rightText">
          {onLink && <Button disabled={disabled} type="primary" icon="link" onClick={() => onLink(this.params)}>Link</Button>}
        </div>
      </React.Fragment>
    );
  }
}

addComponent(RenderLinkSelector, 'default', 'metaselector');
