import every from 'lodash/every';
import { Meteor } from 'meteor/meteor';
import { error } from '../../utils/log';


import withTracker from './withTracker';

const subscribe = sub => Meteor.subscribe(sub, {
  onStop: err => err && error('withSubscription', sub, err),
});

/**
 * HOC for loading data from subscription(s)
 * @param {Array<string>|string} subs - publish name or array of publish names
 * @param {Function<Object>} load - function to load data from collections after subscriptions ready
 */
export const withSubscription = (subs, load) => withTracker((props, onData) => {
  const ready = Array.isArray(subs)
    ? every(subs, sub => subscribe(sub).ready())
    : subscribe(subs).ready();

  if (ready) {
    onData({
      loading: false,
      ...load(props),
    });
  } else {
    // wait till full load, loading component can be added through loadingHandler
    // onData({
    //   loading: true,
    // });
  }
});
