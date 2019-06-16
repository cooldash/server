import React from 'react';
import { Layout, Menu } from 'antd';
import { crmTypes } from '../client';
import { getTypeName } from '../../tree';
import styles from './CrmLayout.module.less';
import { T } from '../../../i18n';
import { withLogin } from '../../../ui/utils/account/withLogin';
import { GoToLogin } from '../../../imperial/client/components/User/GoToLogin';

const { Sider, Header, Content } = Layout;

export default withLogin(GoToLogin)(class CrmLayout extends React.Component {
  onSelect = ({ item, key }) => {
    this.props.router.push(`/crm/${key}`);
  };

  render() {
    const { children } = this.props;

    return (
      <Layout>
        <Sider>
          <div className={styles.logo} >Logo here</div>
          <Menu
            theme="dark"
            onSelect={this.onSelect}
          >
            {crmTypes.map(({ type }) => {
              const typeName = getTypeName(type);
              return (
                <Menu.Item key={typeName}>
                  {T(typeName)}
                </Menu.Item>
              );
            })}
          </Menu>
          {/*<PortalHandler name="sider" />*/}
        </Sider>
        <Layout>
          <Header>
          </Header>
          <Content style={{ margin: 8 }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    );
  }
});
