/**
 * Created by kriz on 27/11/2018.
 */

import React from 'react';
import { Alert } from 'antd';
import { Link } from 'react-router';
import { Trans } from '@lingui/macro';
import { T } from '../../../../i18n';


import Login from '../Login/index';
import { withRegister } from '../../../../ui/utils/account/withRegister';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

class Register extends React.Component {
  state = {
    notice: '',
    type: 'tab1',
    autoLogin: true,
  };
  onSubmit = (err, values) => {
    console.log('value collected ->', { ...values, autoLogin: this.state.autoLogin });
    this.setState({
        notice: '',
      }, () => this.props.doRegister(values.username, values.password)
      .then(() => this.props.router.push('/app'))
      .catch(err => this.setState({
        notice: T(`register.${err.message}`),
      })),
    );
  };
  onTabChange = (key) => {
    this.setState({
      type: key,
    });
  };
  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  render() {
    return (
      <Login
        // defaultActiveKey={this.state.type}
        onTabChange={this.onTabChange}
        onSubmit={this.onSubmit}
      >
        {/*<Tab key="tab1" tab="Account">*/}
        {<div>
          {
            this.state.notice &&
            <Alert style={{ marginBottom: 24 }} message={this.state.notice} type="error" showIcon closable />
          }
        </div>}
        <UserName name="username" />
        <Password name="password" />
        <Password name="passwordAgain" />
        {/*</Tab>*/}
        <Submit><Trans id="auth.signup">Sign Up</Trans></Submit>
        <div>
          <Link style={{ float: 'right' }} to="/login"><Trans id="auth.login">Login</Trans></Link>
        </div>
      </Login>
    );
  }
}

export const RegisterComponent = withRegister(Register);
