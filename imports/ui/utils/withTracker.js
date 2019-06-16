import { Tracker } from 'meteor/tracker';
import compose from '../komposer/compose';

const getTrackerLoader = reactiveMapper => (props, onData, env) => {
  let trackerCleanup = null;
  const _onData = (result, error) => onData(error, result);

  const handler = Tracker.nonreactive(() => Tracker.autorun(() => {
    trackerCleanup = reactiveMapper(props, _onData, env);
  }));

  return () => {
    if (typeof trackerCleanup === 'function') trackerCleanup();
    return handler.stop();
  };
};

export default function container(composer, options = {}) {
  return compose(getTrackerLoader(composer), options);
}
