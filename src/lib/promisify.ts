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
      reject(error);
      worker.terminate();
    }
  });
};

export default promisify;
