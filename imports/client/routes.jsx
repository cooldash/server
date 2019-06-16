import React from 'react';
import { Router, Route, browserHistory, IndexRedirect, IndexRoute } from 'react-router';

import LocaleProvider from '../i18n/LocaleProvider';

// route components
import NotFoundPage from '../ui/pages/NotFoundPage.jsx';
// import ImperialRoutes from '../imperial/client/routes';
import CrmRoutes from '../mods/crm/routes';

import BotRoutes from '../med/ui/routes';


export const renderRoutes = () => (
  <LocaleProvider>
    <Router history={browserHistory}>
      {/*{ImperialRoutes()}*/}
      {BotRoutes()}
      {CrmRoutes()}
      <Route path="*" component={NotFoundPage} />
    </Router>
  </LocaleProvider>
);
