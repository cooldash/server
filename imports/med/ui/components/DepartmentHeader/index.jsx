import React from 'react';
import { Icon, Layout } from 'antd';
import { Link } from 'react-router';
import { T } from '../../../../i18n';
import styles from './index.module.less';

const { Header } = Layout;

export default class DepartmentHeader extends React.Component {
  render() {
    const { department, children, back = '/shop', fixed = true } = this.props;
    return (
      <Header
        className={styles.pageHeader}
        style={{ position: (fixed ? 'fixed' : undefined) }}
      >
        <Link to={back} >
          <Icon type="left" className="side-icon" />
        </Link>
        &nbsp;<h1 className="department-name">{T(department)}</h1>
        {children}
      </Header>
    );
  }
}
