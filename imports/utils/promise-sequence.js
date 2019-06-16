
Promise.seq = (promiseFuncs) => promiseFuncs.reduce(
  (p, promiseFunc) => p.then(promiseFunc),
  Promise.resolve()
);
