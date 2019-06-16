import { error } from './log';

export default function tryLog(fn, logNS = 'tryLog') {
  try {
    fn();
  } catch (err) {
    error(logNS, err);
  }
}
