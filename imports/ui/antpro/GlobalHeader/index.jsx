import React, { PureComponent } from 'react';
import debounce from 'lodash/debounce';
import { Layout, Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import { Link } from 'react-router';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import SideMenu from '../../../med/ui/components/SideMenu/SideMenu';

const { Header } = Layout;

export default class GlobalHeader extends PureComponent {
  constructor(props) {
    super(props);

    this.triggerResizeEvent = debounce(this.triggerResizeEvent, 600);
  }

  componentWillUnmount() {
    if (this.triggerResizeEvent.cancel)
      this.triggerResizeEvent.cancel();
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = ({
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        })[newNotice.status];
        newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  }
  // @Debounce(600)
  triggerResizeEvent = () => { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const {
      currentUser, collapsed, fetchingNotices, isMobile, logo,
      onNoticeVisibleChange, onMenuClick, onNoticeClear, children,
      menuItems,
    } = this.props;
    const menu = (
      <Menu className="menu" selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item disabled><Icon type="setting" /> Profile</Menu.Item>
        <Menu.Item key="triggerError"><Icon type="close-circle" /> Cancel</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" /> Logout</Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    return (<div className="global-header">
      <Header className="header" style={{ height: 48 }} >
        <SideMenu
          collapsed={collapsed}
          onToggle={this.toggle}
          items={menuItems}
          renderIcon={(icon, title) => <Icon type={icon} />}
        />
        {children}
        {/* <div className="right">
          <HeaderSearch
            className="action search"
            placeholder="Search"
            dataSource={['One', 'Two', 'Three']}
            onSearch={(value) => {
              console.log('input', value); // eslint-disable-line
            }}
            onPressEnter={(value) => {
              console.log('enter', value); // eslint-disable-line
            }}
          />
          <NoticeIcon
            className="action"
            count={currentUser.notifyCount}
            onItemClick={(item, tabProps) => {
              console.log(item, tabProps); // eslint-disable-line
            }}
            onClear={onNoticeClear}
            onPopupVisibleChange={onNoticeVisibleChange}
            loading={fetchingNotices}
            popupAlign={{ offset: [20, -16] }}
          >
            <NoticeIcon.Tab
              list={noticeData['miners']}
              title="Miners"
              emptyText="No messages"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
            />
            <NoticeIcon.Tab
              list={noticeData['pool']}
              title="Pool"
              emptyText="No messages"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            />
            <NoticeIcon.Tab
              list={noticeData['personal']}
              title="Personal"
              emptyText="No messages"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
            />
          </NoticeIcon>
          {currentUser.name ? (
            <Dropdown overlay={menu}>
              <span className={`${"action"} ${"account"}`}>
                <Avatar size="small" className="avatar" src={currentUser.avatar} />
                <span className="name">{currentUser.name}</span>
              </span>
            </Dropdown>
          ) : <Spin size="small" style={{ marginLeft: 8 }} />}
        </div>
        */}
      </Header>
    </div>);
  }
}
