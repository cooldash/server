/**
 * Created by kriz on 27/11/2018.
 */

import React from 'react';
import { Alert, Card, Layout, message } from 'antd';
import { Link } from 'react-router';
import { Trans } from '@lingui/macro';

import Login from '../Login/index';
import PageLoading from '../PageLoading/index';
import { T } from '../../../../i18n';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

class LoginComponent extends React.Component {
  state = {
    notice: '',
    type: 'tab1',
    autoLogin: true,
  };
  onSubmit = (err, values) => {
    console.log('value collected ->', { ...values, autoLogin: this.state.autoLogin });
    this.setState({
        notice: '',
      }, () => this.props.doLogin(values.username, values.password)
        .catch(err => {
          const msg = T(err.reason);
          this.setState({
            notice: msg,
          });
          message.error(msg);
        }),
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
        defaultActiveKey={this.state.type}
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
        <div style={{ padding: 8 }}>
          <a href="/docs/instructions.pdf"><Trans>instruction</Trans></a>
        </div>
        <UserName name="username" />
        <Password name="password" />
        {/*</Tab>*/}
        {/*<div>*/}
          {/*<Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>Keep me logged in</Checkbox>*/}
          {/*<a style={{ float: 'right' }} href="">Forgot password</a>*/}
        {/*</div>*/}
        <Submit><Trans id="auth.login">Login</Trans></Submit>
        <div>
          <Link style={{ float: 'right' }} to="/register"><Trans id="auth.signup">Sign Up</Trans></Link>
        </div>
      </Login>
    );
  }
}

export default (props) => (
  props.loggingIn
    ? <PageLoading />
    : <Layout style={{ height: '100%' }}>
      <Card style={{ width: 400, margin: 'auto', marginTop: 100 }}>
        <LoginComponent {...props} />
      </Card>
    </Layout>
)
