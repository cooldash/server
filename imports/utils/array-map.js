/**
 * Collection like map, but can handle arrays as map elements
 * with automatic array creation and pull and push
 */
function ArrayMap () {
  const map = new Map();
  return Object.assign(map, {
  push(key, value) {
    let arr = this.get(key);
    if (!arr) {
      arr = [];
      this.set(key, arr);
    }
    arr.push(value);
    return arr;
  },

  pull(key, value) {
    const arr = this.get(key);
    if (!arr)
      throw new Error(`key ${key} not found in map`);

    const i = arr.indexOf(value);
    if (i < 0)
      throw new Error(`value not found for key ${key} in map`);

    arr.splice(i, 1);
    if (arr.length === 0)
      this.delete(key);
  },

  pullBy(key, predicate) {
    const arr = this.get(key);
    if (!arr)
      throw new Error(`key ${key} not found in map`);

    // remove all predicated elements
    for (let i = 0; i < arr.length; i++) {
      const el = arr[i];
      if (predicate(el, i))
        arr.splice(i, 1);
    }

    if (arr.length === 0)
      this.delete(key);
  }
  });
}

export default ArrayMap;

// Class-version
// class ArrayMap extends Map {
//   push(key, value) {
//     let arr = this.get(key);
//     if (!arr) {
//       arr = [];
//       this.set(key, arr);
//     }
//     arr.push(value);
//     return arr;
//   }
//
//   pull(key, value) {
//     const arr = this.get(key);
//     if (!arr)
//       throw new Error(`key ${key} not found in map`);
//
//     const i = arr.indexOf(value);
//     if (i < 0)
//       throw new Error(`value not found for key ${key} in map`);
//
//     arr.splice(i, 1);
//     if (arr.length === 0)
//       this.delete(key);
//   }
//
//   pullBy(key, predicate) {
//     const arr = this.get(key);
//     if (!arr)
//       throw new Error(`key ${key} not found in map`);
//
//     // remove all predicated elements
//     for (let i = 0; i < arr.length; i++) {
//       const el = arr[i];
//       if (predicate(el, i))
//         arr.splice(i, 1);
//     }
//
//     if (arr.length === 0)
//       this.delete(key);
//   }
// }
