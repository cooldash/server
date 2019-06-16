import React from 'react';
import { Badge, Button, Popover } from 'antd';

import { withPorts } from '../ports/withPorts';

export const BaseServiceComponent = withPorts({ status: withPorts.SOCKET })(({ status }) => (
  status.value ?
    <Popover
      content={<Button size="small" onClick={() => status.send(false)}>Stop</Button>}
      trigger="hover"
    >
      <Button className="popover-button"><Badge status="success" text="Status" /></Button>
    </Popover>
    :
    <Popover
      content={<Button size="small" onClick={() => status.send(true)}>Start</Button>}
      trigger="hover"
    >
      <Button className="popover-button"><Badge status="error" text="Status" /></Button>
    </Popover>
));

export function withBaseService(WrappedComponent) {
  return class extends React.Component {
    state = { status: false };

    render() {
      const { meta, status } = this.props;

      return meta && (
        <div>
          <BaseServiceComponent status={status} />
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  };
}
