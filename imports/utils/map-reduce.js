import ArrayMap from './array-map';

/**
 *
 * @param list
 * @param map
 * @param reduce
 *
 * @code:
   const words = mapReduce(
     ['some lines of', 'some words'],
     (l, add) => l.split(' ').forEach(add),
     lens => lens.length,
   );
 */
export default function mapReduce(list, map, reduce) {
  const arrMap = new ArrayMap();

  function add(key, value) {
    arrMap.push(key, value);
  }

  list.forEach(element => map(element, add));

  const result = {};
  arrMap.forEach((v, k) => {
    result[k] = reduce(v, k)
  });

  return result;
}
