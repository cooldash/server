import React from 'react';
import { IndexRedirect, Route } from 'react-router';

import BasicLayout from './layouts/BasicLayout';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login/Login';
import Logout from './pages/Login/Logout';
import Register from './pages/Login/Register';
import UsersPage from '../admin/UsersPage';
import TestPage from '../TestPage';
import ClinicPage from './pages/ClinicPage';
import ServicesPage from './pages/ServicesPage';
// import AdminUsers from '../users/components/Users';
// import ShopRoutes from '../shop/routes';
// import UsersRoutes from '../users/routes';
// import WarehouseRoutes from '../warehouse/routes';
// import PaymentsRoutes from '../payments/routes';
// import ReportRoutes from '../reports/routes';
// import CheckLogin from './components/User/CheckLogin';

export default () => (
  <Route path="/" component={MainLayout}>
    <IndexRedirect to="app" />
    <Route path="app" component={BasicLayout}>
      <Route path="admin/users" component={UsersPage} />
      <Route path="clinic" component={ClinicPage} />
      <Route path="services" component={ServicesPage} />
      <Route path="tet" component={TestPage} />
      {/*{WarehouseRoutes()}*/}
      {/*{PaymentsRoutes()}*/}
      {/*{ReportRoutes()}*/}
      {/*<Route path="users" component={AdminUsers} />*/}
    </Route>
    <Route path="login" component={Login} />
    <Route path="logout" component={Logout} />
    <Route path="register" component={Register} />
  </Route>
);
