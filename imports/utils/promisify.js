/**
 * Promisify node-style callback
 * @param func - n-ary function with last callback(err, result) as last argument
 * @param context - optional this context for called function
 * @param arity - optional arity of returned function (without callback function)
 * @return {function(...[*]): Promise<any>} (n-1)-ary function returning promise
 */
export const promisify = (func, context, arity) => (...args) => {
  // TODO dont check arity if not specified
  // fix arity of arguments
  if (arity && args.length !== arity) {
    if (args.length < arity) {
      for (let i = args.length; i < arity; i++)
        args.push(undefined);
    } else {
      args.splice(arity);
    }
  }

  return new Promise((res, rej) => {
    func.call(context, ...args, (err, result) => {
      if (err) {
        rej(err);
      } else {
        res(result);
      }
    });
  });
};
