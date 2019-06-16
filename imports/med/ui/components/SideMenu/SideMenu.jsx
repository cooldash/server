import React from 'react';
import { Icon, Menu } from 'antd';
import { withRouter } from 'react-router';
import styles from './SideMenu.module.less';

import { T } from '../../../../i18n';

export default withRouter(class SideMenu extends React.Component {
  onMenuClick = ({ key }) => {
    const { router, items, onToggle } = this.props;
    router.push(items[key].url);
    onToggle();
  };

  render() {
    const { collapsed, onToggle, items, className, renderIcon } = this.props;
    const ir = renderIcon ||
      ((icon, title) => (<img alt={T(title)} src={`/imperial/icons/menu/menu-${icon}.svg`} width={20} />));
    const display = collapsed ? 'none' : 'block';
    return (
      <div className={className}>
        {/*<span onClick={onToggle}>*/}
          {/*<Icon*/}
            {/*type={collapsed ? 'menu-fold' : 'menu-unfold'}*/}
            {/*className="trigger"*/}
          {/*/>*/}
        {/*</span>*/}
        {/*<div className={styles.backdrop} onClick={onToggle} style={{ display, zIndex: 2 }} />*/}
        <Menu
          mode="horizontal"
          theme="light"
          inlineCollapsed={collapsed}
          className="side-menu"
          style={{ width: '100%' }}
          onClick={this.onMenuClick}
        >
          {items.map(({ title, icon }, i) => (
            <Menu.Item key={i}>
              <div className={styles.option}>
                {ir(icon, title)}
                <span className={styles.text}>{T(title)}</span>
              </div>
            </Menu.Item>
          ))}
        </Menu>
      </div>
    );
  }
});
