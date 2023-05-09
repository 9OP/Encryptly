// Adapted from https://github.com/developit/greenlet

type AsyncFunction<S extends any[], T> = (...args: S) => Promise<T>;

type MaybeAsyncFunction<S extends any[], T> = (...args: S) => T | Promise<T>;

enum Resolution {
  RESOLVE = 'resolve',
  REJECT = 'reject',
}

type PromisesRpcHandler<T> = {
  [id: string]: {
    [Resolution.RESOLVE]: (value: T) => void;
    [Resolution.REJECT]: (reason?: any) => void;
  };
};

interface RpcMessage<T> {
  id: number;
  resolution: Resolution;
  payload: T | Error;
}

const greenlet = <S extends any[], T>(
  asyncFunction: MaybeAsyncFunction<S, T>,
): AsyncFunction<S, T> => {
  let currentId = 0;

  const promises: PromisesRpcHandler<T> = {};

  const script =
    'asyncFunction=' +
    asyncFunction +
    ';self.onmessage=' +
    ((event: MessageEvent<S>) => {
      Promise.resolve(event.data[1])
        .then((args) => asyncFunction.apply(asyncFunction, args))
        .then((data) => {
          const message = {
            id: event.data[0],
            resolution: 'resolve',
            payload: data,
          };
          self.postMessage(message);
        })
        .catch((error) => {
          const message = {
            id: event.data[0],
            resolution: 'reject',
            payload: error,
          };
          self.postMessage(message);
        });
    });
  const workerURL = URL.createObjectURL(new Blob([script]));
  const worker = new Worker(workerURL);

  worker.onmessage = (event: MessageEvent<RpcMessage<T>>) => {
    const { id, resolution, payload } = event.data;
    promises[id][resolution](payload as any);
    delete promises[id];
    worker.terminate();
  };

  const callback = (...args: S): Promise<T> => {
    return new Promise((resolve, reject) => {
      promises[++currentId] = { resolve, reject };
      worker.postMessage([currentId, args]);
    });
  };

  return callback;
};

export default greenlet;
