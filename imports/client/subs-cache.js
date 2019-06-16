import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { SubsCache } from 'meteor/ccorcos:subs-cache';

const subsCache = new SubsCache(5, 10);
/**
 * Cached subscription
 */
Meteor.subscribeCached = subsCache.subscribe.bind(subsCache);

Tracker.autorun(() => {
  // autorerun on userId update
  Meteor.userId();

  subsCache.clear();
});
