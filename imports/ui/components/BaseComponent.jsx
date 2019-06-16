/* @flow */

import React from 'react';
import i18n from 'meteor/universe:i18n';

type State = {
  locale: string,
};

class BaseComponent<P, S> extends React.Component<P, State & S> {
  constructor(props: P) {
    super(props);
    // $FlowFixMe - state is ok, will be updated in children
    this.state = {
      locale: 'ru'
      // locale: i18n.getLocale(),
    };
  }

  componentWillMount() {
    // i18n.onChangeLocale(this.handleLocaleChange);
  }

  componentWillUnmount() {
    // i18n.offChangeLocale(this.handleLocaleChange);
  }

  handleLocaleChange = (locale: string) => {
    this.setState({ locale });
  };
}

export default BaseComponent;
