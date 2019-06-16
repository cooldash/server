import React from 'react';
import { Layout } from 'antd';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { t } from '@lingui/macro';
import classNames from 'classnames';
// import DocumentTitle from 'react-document-title';
// import isEqual from 'lodash/isEqual';
// import memoizeOne from 'memoize-one';
// import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
// import { formatMessage } from 'umi/locale';
// import SiderMenu from '../components/SiderMenu';
// import Authorized from '../utils/Authorized';
// import SettingDrawer from '../components/SettingDrawer';
// import logo from '../assets/logo.svg';
import Header from './Header';
import { withLogin } from '../../../ui/utils/account/withLogin';
import Roles from '../../../mods/roles';
import { GoToLogin } from '../components/User/GoToLogin';

// import Exception403 from '../pages/Exception/403';

const { Content } = Layout;

const menuItems = [
  // { path: '/robot/accounts', name: 'accounts', icon: 'pie-chart'},
  // { path: '/robot/dashboard', name: 'dashboard' },
  // { url: '/app/warehouse/debit', title: t('warehouse.debit')`Склад приход`, permission: 'warehouse.orders.r', icon: 'download' },
  // { url: '/app/warehouse/credit', title: t('warehouse.credit')`Склад расход`, permission: 'sales.orders.r', icon: 'upload' },
  // { url: '/app/warehouse/stocks', title: t('warehouse.stocks')`Склад остатки`, permission: 'warehouse.orders.r', icon: 'upload' },
  // { url: '/app/payments/debit', title: t('payments-debit')`Платежи`, permission: 'payments.payment.r', icon: 'dollar' },
  // { url: '/app/payments/top', title: t('payments-debit')`Платежи`, permission: 'payments.payment.receiveCashbox', icon: 'dollar' },
  { url: '/app/admin/users', title: t('users')`Пользователи`, permission: 'users.r', icon: 'table' },
  { url: '/app/clinic', title: t('clinic')`Учреждение`, permission: 'clinic.w', icon: 'home' },
  { url: '/app/services', title: t('services')`Услуги`, permission: 'clinic.w', icon: 'tool' },
  { url: '/crm', title: t('crm')`CRM`, permission: 'crm', icon: 'edit' },
  { url: '/logout', title: t`logout`, className: 'pull-right', icon: 'logout' },
];

// Conversion router to menu.
// function formatter(data, parentAuthority, parentName) {
//   return data
//     .map(item => {
//       if (!item.name || !item.path) {
//         return null;
//       }
//
//       let locale = 'menu';
//       if (parentName) {
//         locale = `${parentName}.${item.name}`;
//       } else {
//         locale = `menu.${item.name}`;
//       }
//
//       const result = {
//         ...item,
//         name: formatMessage({ id: locale, defaultMessage: item.name }),
//         locale,
//         authority: item.authority || parentAuthority,
//       };
//       if (item.routes) {
//         const children = formatter(item.routes, item.authority, locale);
//         // Reduce memory usage
//         result.children = children;
//       }
//       delete result.routes;
//       return result;
//     })
//     .filter(item => item);
// }

// const memoizeOneFormatter = memoizeOne(formatter, isEqual);

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.getPageTitle = memoizeOne(this.getPageTitle);
    // this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    // this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  state = {
    collapsed: true,
    rendering: true,
    isMobile: false,
    menuData: this.getMenuData(),
  };

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'user/fetchCurrent',
    // });
    // dispatch({
    //   type: 'setting/getSetting',
    // });
    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false,
      });
    });
    // this.enquireHandler = enquireScreen(mobile => {
    //   const { isMobile } = this.state;
    //   if (isMobile !== mobile) {
    //     this.setState({
    //       isMobile: mobile,
    //     });
    //   }
    // });
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    const { isMobile, collapsed } = this.state;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    // unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
    };
  }

  getMenuData() {
    // const {
    //   route: { routes },
    // } = this.props;
    return menuItems.filter(route => {
      return !route.permission || Roles.hasPermission(route.permission);
    });
  }

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(this.getMenuData());
    return routerMap;
  }

  matchParamsPath = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap)
      .find(key =>
        pathToRegexp(key)
          .test(pathname),
      );
    return this.breadcrumbNameMap[pathKey];
  };

  getPageTitle = pathname => {
    const currRouterData = this.matchParamsPath(pathname);

    if (!currRouterData) {
      return 'Ant Design Pro';
    }
    // const message = formatMessage({
    //   id: currRouterData.locale || currRouterData.name,
    //   defaultMessage: currRouterData.name,
    // });
    // return `${message} - Ant Design Pro`;
  };

  getLayoutStyle = () => {
    const { isMobile, collapsed } = this.state;
    const { fixSiderbar, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      margin: '24px 24px 0',
      paddingTop: fixedHeader ? 64 : 0,
    };
  };

  handleMenuCollapse = collapsed => {
    this.setState(() => ({ collapsed }));
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'global/changeLayoutCollapsed',
    //   payload: collapsed,
    // });
  };

  renderSettingDrawer() {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    const { rendering } = this.state;
    if ((rendering || process.env.NODE_ENV === 'production') && APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer />;
  }

  render() {
    const {
      navTheme,
      layout: PropsLayout = 'topmenu',
      children,
      location: { pathname },
      ...rest
    } = this.props;
    const { isMobile, menuData, collapsed } = this.state;
    const isTop = PropsLayout === 'topmenu';
    const routerConfig = this.matchParamsPath(pathname);
    const layout = (
      <Layout
        style={{ height: '100%' }}
      >
        {/*{isTop && !isMobile ? null : (*/}
          {/*<SiderMenu*/}
            {/*logo={logo}*/}
            {/*Authorized={Authorized}*/}
            {/*theme={navTheme}*/}
            {/*onCollapse={this.handleMenuCollapse}*/}
            {/*menuData={menuData}*/}
            {/*isMobile={isMobile}*/}
            {/*{...this.props}*/}
          {/*/>*/}
        {/*)}*/}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '20vh',
            height: '100%',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            // logo={logo}
            isMobile={isMobile}
            setting={{ navTheme: 'dark', fixedHeader: false }}
            collapsed={collapsed}
            {...rest}
          />
          <Content style={this.getContentStyle()}>
            {children}
          </Content>
          {/*<Footer />*/}
        </Layout>
      </Layout>
    );
    return layout;
    // return (
    //   layout
    // );
  }
}

export default withLogin(GoToLogin)(DragDropContext(HTML5Backend)(BasicLayout));
