const promisify = <T, K>(worker: Worker, args: T): Promise<K> => {
  return new Promise((resolve, reject) => {
    try {
      worker.onmessage = (result) => {
        resolve(result.data);
        worker.terminate();
      };

      worker.onerror = (error) => {
        reject(error);
        worker.terminate();
      };

      worker.postMessage(args);
    } catch (error) {
      worker.terminate();
      reject(error);
    }
  });
};

export default promisify;
