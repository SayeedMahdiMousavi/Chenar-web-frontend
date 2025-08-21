export const memoizeFun = (fun: any) => {
  const cache: any = {};

  return function (...args: any) {
    if (cache[args]) {
      return cache[args];
    }
    //@ts-ignore
    const result = fun.apply(this, args);
    cache[args] = result;
    return result;
  };
};
