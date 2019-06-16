import each from 'lodash/each';
import identity from 'lodash/identity';

/**
 * Map array or object to another object
 * @param from - iterable collection
 * @param iteratee - receiving iterated element and must return array of [key, value].
 *   if value is undefined, key will not be added to resulting object, it could be used for filtering
 * @return object of keys and values returned by iteratee
 */
function mapToObject(from, iteratee = identity) {
  const result = {};
  each(from, (value, key) => {
    const [k, v] = iteratee(value, key);
    if (v !== undefined)
      result[k] = v;
  });
  return result;
}

export default mapToObject;
