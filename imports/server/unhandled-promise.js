import { error, fatal } from '../utils/log';

process.on('unhandledRejection', err => {
  // Will print "unhandledRejection err is not defined"
  error('Unhandled Promise Rejection', err.stack);
});

process.on('uncaughtException', err => {
  fatal('Unhandled Exception', err.stack);
});
