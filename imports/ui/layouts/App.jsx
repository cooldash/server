import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Layout, Icon } from 'antd';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'; // XXX: SESSION
// import { Lists } from '../../modules/lists/lists.js';
// import UserMenu from '../components/UserMenu.jsx';
// import ListList from '../components/ListList.jsx';
// import LanguageToggle from '../components/LanguageToggle.jsx';
// import ConnectionNotification from '../components/ConnectionNotification.jsx';
// import Loading from '../components/Loading.jsx';
import { PortalHandler } from '../helpers/Portal';

import SiderMenu from "../antpro/SiderMenu/SiderMenu";
// import GlobalHeader from "../antpro/GlobalHeader/index";
import GlobalFooter from "../antpro/GlobalFooter";

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { ToolbarReact } from '../../mods/types/Toolbar';

const CONNECTION_ISSUE_TIMEOUT = 5000;

const isMobile = Meteor.isCordova;
const menuData = [
  // {
  //   name: 'Miners',
  //   icon: 'profile',
  //   path: '/miners',
  // },
  // {
  //   name: 'Settings',
  //   icon: 'setting',
  //   path: '/settings',
  // },
  {
    name: 'Tree',
    icon: 'api',
    path: '/tree',
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showConnectionIssue: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({ showConnectionIssue: true });
    }, CONNECTION_ISSUE_TIMEOUT);
  }

  componentWillReceiveProps({ loading, children }) {
  }

  toggleMenu = (menuCollapsed = !Session.get('menuCollapsed')) => {
    Session.set({ menuCollapsed });
  };
  closeMenu = () => this.toggleMenu(true);

  logout = () => {
    Meteor.logout();
  };

  render() {
    const { showConnectionIssue } = this.state;
    const {
      user,
      connected,
      loading,
      lists,
      menuCollapsed,
      children,
      location,
    } = this.props;

    this.context.router.history = this.context.router;

    // clone route components with keys so that they can
    // have transitions
    const clonedChildren = children && React.cloneElement(children, {
      key: location.pathname,
    });

    const currentUser = {
      name: 'Admin',
      avatar: 'https://thumbs.dreamstime.com/b/vector-icon-user-avatar-web-site-mobile-app-man-face-flat-style-social-network-profile-45837377.jpg',
      notifyCount: 3,
    };

    return (
      <Layout>
        <SiderMenu
          title="Treenity"
          logo="/assets/logo/treenity.svg"
          Authorized={true}
          menuData={menuData}
          collapsed={menuCollapsed}
          location={this.props.location}
          isMobile={isMobile}
          onCollapse={() => {}}
          width={250}
        >
          <PortalHandler name="sidebar" />
        </SiderMenu>
        <Layout>
          {/*<GlobalHeader*/}
            {/*logo="/assets/logo/logo-square.png"*/}
            {/*currentUser={currentUser}*/}
            {/*// fetchingNotices={fetchingNotices}*/}
            {/*// notices={notices}*/}
            {/*collapsed={menuCollapsed}*/}
            {/*isMobile={isMobile}*/}
            {/*// onNoticeClear={this.handleNoticeClear}*/}
            {/*onCollapse={this.toggleMenu}*/}

            {/*// onMenuClick={this.handleMenuClick}*/}
            {/*// onNoticeVisibleChange={this.handleNoticeVisibleChange}*/}
          {/*>*/}
            {/*<PortalHandler name="toolbar" />*/}
          {/*</GlobalHeader>*/}
          <Layout.Content style={{ margin: '16px 16px 0', height: '100%' }}>
            {clonedChildren}
          </Layout.Content>
          <GlobalFooter
            links={[{
              key: 'Treenity',
              title: 'Treenity',
              href: 'http://treenity.wintwin.ru',
              blankTarget: true,
            }, {
              key: 'github',
              title: <Icon type="github" />,
              href: 'https://github.com/ant-design/ant-design-pro',
              blankTarget: true,
            }]}
            copyright={
              <div>
                Copyright <Icon type="copyright" /> 2018 Whalers
              </div>
            }
          />
        </Layout>
      </Layout>
    );
  }
}

App.propTypes = {
  user: PropTypes.object,      // current meteor user
  connected: PropTypes.bool,   // server connection status
  loading: PropTypes.bool,     // subscription status
  menuCollapsed: PropTypes.bool,    // is side menu open?
  lists: PropTypes.array,      // all lists visible to the current user
  children: PropTypes.element, // matched child route component
  location: PropTypes.object,  // current router location
  params: PropTypes.object,    // parameters of the current route
};

App.contextTypes = {
  router: PropTypes.object,
};

export default DragDropContext(HTML5Backend)(App);
