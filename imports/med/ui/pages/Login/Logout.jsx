/**
 * Created by kriz on 28/11/2018.
 */

import React from 'react';
import { Meteor } from 'meteor/meteor';

class Logout extends React.Component {
  componentDidMount() {
    Meteor.logout(() =>
      this.props.router.push('/login'),
    );
  }

  render() {
    return '';
  }
}

export default Logout;
