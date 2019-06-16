const crypto = require('crypto');

export function md5(data) {
  return crypto.createHash('md5').update(data).digest("hex");
}
