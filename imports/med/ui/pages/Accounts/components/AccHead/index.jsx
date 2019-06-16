import React from 'react';
import { formatMessage } from '../../../../../../../i18n';
import { Button, Col, Row, Switch } from 'antd';
import styles from './index.module.less';

export default function AccHead({ currentdata, setBotStatus }) {
  return (
    <Row>
      <Col span={12}>
        <h3 className={styles.header}> {currentdata.title} </h3>
      </Col>
      <Col span={12} className={styles.secondcol}>
        <span>{formatMessage({ id: 'app.accounts.acchead.switchtitle' })}</span>
        <Switch
          className={styles.switcher}
          checkedChildren="On"
          unCheckedChildren="Off"
          checked={currentdata.botstatus}
          onChange={setBotStatus}
        />
      </Col>
      {/*<Col span={8} className={styles.thirdcol}>*/}
        {/*<Button type="primary" ghost>*/}
          {/*{formatMessage({ id: 'app.accounts.acchead.delbutton' })}*/}
        {/*</Button>*/}
      {/*</Col>*/}
    </Row>
  );
}
