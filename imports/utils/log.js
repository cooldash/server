import { Meteor } from 'meteor/meteor';

function getLogger() {
  if (Meteor.isServer) {
    const bunyan = require('bunyan');
    const PrettyStream = require('./bunyan-prettystream');
    // const bsyslog = require('bunyan-syslog');

    const consoleStream = new PrettyStream({
      mode: Meteor.isDevelopment ? 'dev' : 'short',
      // TERM is not defined if running inside WebStorm, and webstorm will print time by itself
      noTime: !process.env.TERM && !process.env.NODE_VERSION,
    });
    consoleStream.pipe(process.stdout);

    return bunyan.createLogger({
      name: 'treenity',
      level: 'debug',
      streams: [
        {
          stream: consoleStream,
          type: 'raw',
        },
      ],
    });
  } else {
    return console;
  }
}

const logger = getLogger();

let withFormat = func => (sub, ...args) => {
  return func.call(logger, `[${sub}]`, ...args);
};
if (Meteor.isServer) {
  const clc = require("cli-color");
  withFormat = (func, color = 'white') => (sub, ...args) => {
    return func.call(logger, clc[color](`[${sub}]`), ...args);
  }
}

const trace = withFormat(logger.trace);
const debug = withFormat(logger.debug, 'blue');
const info = withFormat(logger.info, 'green');
const warn = withFormat(logger.warn, 'magenta');
const error = withFormat(logger.error, 'red');
const fatal = withFormat(logger.fatal, 'red');
const except = (...args) => {
  error(...args);
  throw new Error(...args);
};

export default logger;
export {
  trace,
  debug,
  info,
  warn,
  error,
  fatal,
  except,
};
