/**
 * Created by kriz on 08/02/2019.
 */

import React from 'react';
import { withRouter } from 'react-router';

export const GoToLogin = withRouter(class extends React.Component {
  componentDidMount() {
    this.check(this.props);
  }

  componentWillReceiveProps(props) {
    this.check(props);
  }

  check = props => {
    if (!props.loggingIn)
      props.router.push('/login');
  };

  render() {
    return null;
  }
});
