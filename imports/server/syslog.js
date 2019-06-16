import { Meteor } from 'meteor/meteor';
import logger, { debug, warn } from '../utils/log';

const sprintf = require('util').format;

const LEVELS = {
  60: 0, // FATAL:
  50: 3, // ERROR:
  40: 4, // WARN:
  30: 6, // INFO:
  20: 7, // DEBUG:
};

// Translates a Bunyan level into a syslog level
function getLevel(l) {
  return LEVELS[l] || 7; // Default to debug
}

if (process.platform === 'win32') {
  warn('syslog is not supported on Win platform');
} else if (Meteor.settings.syslog) {
  const UDPStream = require('bunyan-syslog/lib/udp');

  class SyslogStream extends UDPStream {
    write(r) {
      const h = r.hostname;
      let l = getLevel(r.level);
      const m = r.msg;
      const t = new Date(r.time).toJSON();

      l += (this.facility * 8);
      const hdr = sprintf('<%d>%s %s %s[%d]:', l, t, h, this.name, process.pid);
      this._send(hdr + m);
    }
  }

  const { level, type, name, host, port } = Meteor.settings.syslog;
  const stream = new SyslogStream({
    type: type || 'udp',
    facility: 16, // bunyan-syslog.local0
    host,
    port,
  });

  logger.addStream({
    name: name || 'syslog',
    level: level || 'debug',
    type: 'raw',
    stream,
  });

  debug(name || 'SYSLOG', 'activated');
}
