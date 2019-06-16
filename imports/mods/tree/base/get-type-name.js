import { Type } from 'meteor/treenity:astronomy';
import assert from '../../../utils/assert';

/**
 *  Trying to guess type name of value or type, guide me if it is a value with second param
 *
 */
export function getTypeName(type, isValue) {
  // noinspection EqualityComparisonWithCoercionJS
  if (!type) { // null, or undefined
    return 'null';
  }

  if (typeof type === 'function') {
    if (type.className)
      return type.className;

    // className for jagi:astronomy
    const t = Type.find(type);
    if (t)
      return t.name;

    return type.name || 'function';
  }

  if (typeof type === 'string' && !isValue) {
    return type;
  }
  if (Array.isArray(type)) {
    assert(type.length === 1, 'wrong array type');
    return `[${getTypeName(type[0])}]`;
  }
  if (typeof type === 'object' && type.constructor) {
    return getTypeName(type.constructor);
  }

  return typeof type;
}
