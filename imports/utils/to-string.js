/* eslint-disable prefer-template */
import map from 'lodash/map';

export function toStringDeep(obj) {
  if (obj === undefined) return '[undefined]';
  if (obj === null) return 'null';
  if (Array.isArray(obj))
    return `[${obj.map(o => toStringDeep(o)).join(', ')}]`;
  if (typeof obj === 'object' && obj.toString === Object.prototype.toString) { // simple object
    return '{\n' +
      map(obj, (val, key) => `  ${key}: ${toStringDeep(val)},`).join('\n') +
      '\n},\n';
  }
  if (typeof obj === 'string')
    return `'${obj}'`;

  try {
    return `${obj}`;
  } catch(err) {
    return `'Error while convert: ${err}'`;
  }
}
