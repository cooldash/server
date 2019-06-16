/**
 * Created by kriz on 06/01/2019.
 */

import React from 'react';
import { Route, IndexRoute } from 'react-router';
import CrmLayout from './components/CrmLayout';
import CrmTable from './components/CrmTable';

export default () => (
  <Route path="crm" component={CrmLayout}>
    <Route path=":typeName" component={CrmTable} />
  </Route>
);
