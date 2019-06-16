import { error } from './log';

export const checkPromise = promise => {
  promise.catch(err => error('PROMISE', 'Checked promise exception: ', err));
};
