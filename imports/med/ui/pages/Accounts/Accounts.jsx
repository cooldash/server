import React, { Component } from 'react';
import moment from 'moment';
import { Button, Card, Col, Divider, Layout, Row } from 'antd';

import Sidebar from './components/Sidebar/index';
import AccHead from './components/AccHead/index';
import Status from './components/Status/index';
import AccTable from './components/AccTable/index';
import { formatMessage } from '../../../../../i18n';
import { StrategySignal } from '../../../../binance-bot/signal/signal.meta';

const { Content, Sider } = Layout;

class Accounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  render() {
    const { current } = this.state;
    const { account, botRader, node, orders, setBotStatus } = this.props;

    const accs = [{
      exchange: account.exchange,
      botstatus: account.realTrading,
      title: botRader.name,
      current: true,
      datecreated: moment(node.createdAt).format('DD.MM.YYYY'),
      // start: 0.1,
      // now: 0.14,
      currency: 'BTC',
      totalBtc: account.totalBtc,
      balance: account.balance,
      orders: orders
        .map(n => n.getMeta(StrategySignal))
        // .filter(s => s && s.realTrade)
        .sort((l, r) => l.time - r.time),
      // waitincome: 0.08,
    }];

    const currentAcc = accs[current];

    return (
      <Content style={{ margin: '-8px -8px 16px -8px' }}>
        {/*<Card style={{ marginBottom: '16px' }}>*/}
          {/*<Row>*/}
            {/*<Col span={12}>*/}
              {/*<h2 style={{ marginBottom: '0px' }}>*/}
                {/*{formatMessage({ id: 'app.accounts.header.text' })}*/}
              {/*</h2>*/}
            {/*</Col>*/}
            {/*<Col span={12} style={{ textAlign: 'right' }}>*/}
              {/*<Button href="./hello" type="primary">*/}
                {/*{formatMessage({ id: 'app.accounts.header.button' })}*/}
              {/*</Button>*/}
            {/*</Col>*/}
          {/*</Row>*/}
        {/*</Card>*/}
        <Layout>
          <Sider width={205} style={{ background: '#fff', marginRight: '16px' }}>
            <Card bordered={false}>
              <h3 style={{ marginBottom: '0px', lineHeight: '32px' }}>
                {formatMessage({ id: 'app.accounts.sidebar.header' })}
              </h3>
            </Card>
            <Divider style={{ marginTop: '0px', marginBottom: '0px' }} />
            <Card bordered={false}>
              <Sidebar alldata={accs} />
            </Card>
          </Sider>

          <Content>
            <Card bordered={false}>
              <AccHead currentdata={accs[current]} setBotStatus={setBotStatus} />
            </Card>
            <Divider style={{ marginTop: '0px', marginBottom: '0px' }} />
            <Card bordered={false}>
              <Status currentdata={currentAcc} />
              <AccTable orders={currentAcc.orders} />
            </Card>
          </Content>
        </Layout>
      </Content>
    );
  }
}

export default Accounts;
