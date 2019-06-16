/**
 * Created by kriz on 14/02/2019.
 */

import React from 'react';
import { GoToLogin } from './GoToLogin';
import { withLogin } from '../../../../ui/utils/account/withLogin';

const RenderChildren = ({ children, ...props }) => {
  // if (Impersonate)
  return React.cloneElement(React.Children.only(children), props);
};

export default withLogin(GoToLogin, { permission: 'shop.user' })(RenderChildren);
