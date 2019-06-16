import { useCallback } from 'react';
import { memoize } from 'lodash';

export const useCache = (fn, dep) => useCallback(memoize(fn), dep);
