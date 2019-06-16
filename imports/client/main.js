/* global document */
import React from 'react';

import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import 'reset-css/less/reset.less';

import '../common';
// import '../tree/index.client';
import '../mods/client';
import './subs-cache';

// Styles
import './styles/main-css.css';
import './styles/main-less.less';

import App from './App';

Meteor.startup(() => {
  render(<App />, document.getElementById('app'));
});
