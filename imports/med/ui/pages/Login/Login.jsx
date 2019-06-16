/**
 * Created by kriz on 28/11/2018.
 */

import React from 'react';
import LoginComponent from '../../components/User/Login';
import { withLogin } from '../../../../ui/utils/account/withLogin';
import Roles from '../../../../mods/roles';

class WhenLoggedIn extends React.Component {
  componentDidMount() {
    const { router } = this.props;
    router.push('/app');
  }

  render() {
    return '';
  }
}

const Login = withLogin(LoginComponent)(WhenLoggedIn);

export default Login;
