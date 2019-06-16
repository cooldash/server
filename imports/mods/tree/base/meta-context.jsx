/* @flow */

import React from 'react';
import flattenDeep from 'lodash/flattenDeep';

const toArray = context => {
  if (!context)
    return [];

  if (typeof context === 'string')
    return context.split(' ');
  else if (Array.isArray(context))
    return context;

  throw new Error(`context of wrong type ${typeof context}`);
};

export const Context = React.createContext('');

type Props = {
  render?: (any) => React.Node,
  children?: (any) => React.Node,
};

type State = {
  added: { [string]: string },
  name: string,
}

export default class MetaContext extends React.PureComponent<Props, State> {
  parent: MetaContext;
  state = { added: {}, context: '' };

  constructor(props) {
    super(props);
    this.state.context = props.context;
    this.name = props.name;
  }

  toString() {
    return this.getContext().join(' ');
  }

  addContext(context, name = '') {
    if (name)
      return this.findNamedContext(name).addContext(context);

    const added = { ...this.state.added, [context]: toArray(context) };
    this.setState({ added });

    return () => {
      const _added = { ...this.state.added };
      delete _added[context];
      this.setState({ added: _added });
    };
  }

  getContext() {
    let result = [];
    if (this.parent) {
      if (this.parent === this)
        console.error('Context parent equals to this context');
      else
        result = [...result, ...this.parent.getContext()];
    }

    // const added = Object.values(this.state.added);

    result = [
      ...result,
      ...toArray(this.state.context),
      ...Object.values(this.state.added),
    ];

    return flattenDeep(result);
  }

  has(tag) {
    return this.getContext().includes(tag);
  }

  _setParent(parent) {
    this.parent = parent;
  }

  findNamedContext(name) {
    if (this.name === name) {
      return this;
    }

    if (this.parent) {
      return this.parent.findNamedContext(name);
    }

    throw new Error(`Context with name (${name}) not found`);
  }

  // It's unnecessary now
  getNearSpecificContext(context) {
    let contextItems = toArray(context);
    let containContext = this.getContext().some((c) => contextItems.includes(c));

    if (containContext)
      return this;

    if (this.parent)
      return this.parent.getNearSpecificContext(context);

    throw new Error(`Context (${context}) not found`);
  }

  toString() {
    return this.getContext().join(' ');
  }

  render() {
    const { render, children } = this.props;
    const child = render || children;
    return (
      <Context.Consumer>
        {parentContext => {
          this._setParent(parentContext);

          return (
          <Context.Provider value={this}>
            {(typeof child === 'function') ? child(this) : child}
          </Context.Provider>
        )}}
      </Context.Consumer>
    );
  }
}
