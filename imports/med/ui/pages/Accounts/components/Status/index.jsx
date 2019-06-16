import React from 'react';
import { Col, Row, Collapse } from 'antd';
import styles from './index.module.less';
import './index.less';
import { formatMessage, t } from '../../../../../../../i18n';

export default function Status({ currentdata }) {
  return (
    <Row>
      <Col span={12}>
        <table className={styles.mini}>
          <tbody>
          <tr>
            <td>{formatMessage({ id: 'app.accounts.status.exchange' })}</td>
            <td>{currentdata.exchange}</td>
          </tr>
          <tr>
            <td>{formatMessage({ id: 'app.accounts.status.create' })}</td>
            <td>{currentdata.datecreated}</td>
          </tr>
          <tr>
            <td>{formatMessage({ id: 'app.accounts.status.status' })}</td>
            <td
              className={`${styles.status} ${currentdata.botstatus && styles.botstatus}`}
            >
              {currentdata.botstatus ? t('app.accounts.status.status.work') : t('app.accounts.status.status.stop')}
            </td>
          </tr>
          </tbody>
        </table>
      </Col>
      <Col span={12}>
        <Collapse bordered={false} className={`${styles.collapse} status-collapse`}>
          <Collapse.Panel
            header={`${formatMessage({ id: 'app.accounts.status.balance' })}${currentdata.totalBtc.toFixed(8)}`}
            key="1"
            className={styles.panel}
          >
            <table className={styles.mini}>
              <thead>
              <tr>
                <td width="80px">{t('app.accounts.status.coin')}</td>
                <td width="80px">{t('app.accounts.status.free')}</td>
                <td width="80px">{t('app.accounts.status.used')}</td>
              </tr>
              </thead>
              <tbody>
              {currentdata.balance.value.map(v => (
                <tr key={v.cur}>
                  <td >{v.cur}</td>
                  <td style={{ textAlign: "end" }}>{v.free.toFixed(4)}</td>
                  <td style={{ textAlign: "end" }}>{v.used.toFixed(4)}</td>
                </tr>
              ))}
              </tbody>
            </table>

          </Collapse.Panel>
        </Collapse>
      </Col>
      {/*<Col span={8}>*/}
      {/*<table>*/}
      {/*<tr>*/}
      {/*<td>{formatMessage({ id: 'app.accounts.status.start' })}</td>*/}
      {/*<td>*/}
      {/*{currentdata.start} {currentdata.currency}*/}
      {/*</td>*/}
      {/*</tr>*/}
      {/*<tr>*/}
      {/*<td>{formatMessage({ id: 'app.accounts.status.current' })}</td>*/}
      {/*<td>*/}
      {/*{currentdata.now} {currentdata.currency}*/}
      {/*</td>*/}
      {/*</tr>*/}
      {/*</table>*/}
      {/*</Col>*/}
      {/*<Col span={12}>*/}
      {/*<table>*/}
      {/*<tr>*/}
      {/*<td>{formatMessage({ id: 'app.accounts.status.expectedincome' })}</td>*/}
      {/*<td>*/}
      {/*{currentdata.waitincome} {currentdata.currency}*/}
      {/*</td>*/}
      {/*</tr>*/}
      {/*</table>*/}
      {/*</Col>*/}
    </Row>
  );
}
