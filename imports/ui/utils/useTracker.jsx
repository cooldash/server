import { useCallback, useEffect, useState } from 'react';
import { Tracker } from 'meteor/tracker';

export const useTracker = (reactiveFn, dependencies) => {
  // use state to call all useTracker update
  const [result, setResult] = useState(null);

  let computation;
  // don't call set-state on first tracker run,
  // we will get and return result immediately here
  let canSetState = false;

  // use callback here not call tracker without deps change
  const trackerCallback = () => {
    let callbackResult = undefined;
    Tracker.nonreactive(() => {
      computation = Tracker.autorun(() => {
        callbackResult = reactiveFn();
        if (canSetState) {
          setResult(callbackResult);
        }
      });
    });
    return callbackResult;
  };
  const callback = useCallback(
    trackerCallback,
    dependencies,
  );

  // also don't call computation stop with no deps change
  useEffect(
    () => () => computation.stop(),
    dependencies,
  );

  // if callback is the same as passed to useCallback, deps changed - call it
  // else change was by state change
  const ret = callback === trackerCallback ? callback() : result;

  canSetState = true;

  return ret;
};
