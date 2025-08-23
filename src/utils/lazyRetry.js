export const lazyRetry = (
  componentImport,
  retriesLeft = 3,
  interval = 1500,
) => {
  return new Promise((resolve, reject) => {
    componentImport()
      .then(resolve)
      .catch((error) => {
        if (retriesLeft === 1) {
          reject(error);
          return;
        }
        setTimeout(() => {
          lazyRetry(componentImport, retriesLeft - 1, interval)
            .then(resolve)
            .catch(reject);
        }, interval);
      });
  });
};
