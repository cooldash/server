import { useState } from 'react';
import meteorCall from '../../utils/meteor-async-call';
import { error } from '../../utils/log';

const NO_RESULT = Symbol('method-no-result');
const METHOD_CALLED = Symbol('method-no-result');

export const useMeteorCall = (method, ...params) => {
  const [result, setResult] = useState(NO_RESULT);
  const [prevParam, setParams] = useState(params);
  if (!prevParam.every((p, i) => (p === params[i]))) {
    setResult(NO_RESULT);
    setParams(params);
    return null;
  }

  if (result === NO_RESULT) {
    setResult(METHOD_CALLED);
    meteorCall(method, ...params)
      .then(setResult)
      .catch(err => error('METEOR', err));

    return null;
  } else if (result === METHOD_CALLED) {
    return null;
  }

  return result;
};
