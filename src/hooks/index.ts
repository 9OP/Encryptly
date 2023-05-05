import { useCallback, useContext } from 'react';
import { AppContext } from '@app/context';
import { generateEncryptionKey, wrapEncryptionKey } from '@app/lib/crypto';
import promisify from '@app/lib/promisify';
import {
  delStorageAccessToken,
  getStorageAccessToken,
  setStorageAccessToken,
} from '@app/lib/storage';
import DecryptWorker from '@app/lib/webworkers/decrypt.worker?worker';
import EncryptWorker from '@app/lib/webworkers/encrypt.worker?worker';
import useSWR, { mutate } from 'swr';

import {
  deleteAppFolder,
  deleteFile,
  downloadFile,
  getStorageQuota,
  getUserFiles,
  getUserInfo,
  loadAppData,
  revokeToken,
  saveAppData,
  uploadFile,
} from './http';

export const useIsAuthenticated = () => {
  const { accessToken, encryptionKey } = useContext(AppContext);
  const hasAccessToken = accessToken.value != '' && accessToken.value != null;
  const hasEncryptionKey = encryptionKey.value != '' && encryptionKey.value != null;
  return hasAccessToken && hasEncryptionKey;
};

export const useRecoverAccessToken = () => {
  const { accessToken } = useContext(AppContext);

  return async () => {
    const token = getStorageAccessToken();

    if (token) {
      try {
        await getUserInfo(token);
        accessToken.setValue(token);
        setStorageAccessToken(token);
        return true;
      } catch (err) {
        accessToken.setValue('');
        delStorageAccessToken();
      }
    }

    return false;
  };
};

export const useUserInfo = () => {
  const { accessToken } = useContext(AppContext);

  return useSWR('UserInfo', () => getUserInfo(accessToken.value));
};

export const useLogout = () => {
  const { accessToken, encryptionKey } = useContext(AppContext);

  return async () => {
    sessionStorage.clear();
    encryptionKey.setValue('');
    await revokeToken(accessToken.value);
    accessToken.setValue('');

    // Clear all previous, to force refetch new data with new token/user
    await mutate(() => true, undefined, {
      revalidate: true,
      populateCache: true,
    });
  };
};

export const useDriveQuota = () => {
  const { accessToken } = useContext(AppContext);
  return useSWR('driveQuota', () => getStorageQuota(accessToken.value));
};

export const useListFiles = () => {
  const { accessToken } = useContext(AppContext);
  return useSWR('listFiles', () => getUserFiles(accessToken.value), {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });
};

export const revalidateListFiles = async () => {
  const keys = ['listFiles', 'driveQuota'];

  await mutate((key: string) => keys.includes(key), undefined, {
    revalidate: true,
    populateCache: false,
  });
};

export const useEncryptFile = () => {
  const { encryptionKey } = useContext(AppContext);

  return useCallback(
    (file: File): Promise<Blob> => {
      const worker = new EncryptWorker();
      return promisify(worker, { file, key: encryptionKey.value });
    },
    [encryptionKey.value],
  );
};

export const useDecryptFile = () => {
  const { encryptionKey } = useContext(AppContext);

  return useCallback(
    async (data: Blob): Promise<Blob> => {
      const worker = new DecryptWorker();
      return promisify(worker, { data, key: encryptionKey.value });
    },
    [encryptionKey.value],
  );
};

export const useUploadFile = () => {
  const { accessToken } = useContext(AppContext);

  return async (file: { data: Blob; name: string }) => {
    const generator = await uploadFile(accessToken.value, file.name, file.data);
    return generator;
  };
};

export const useDownloadFile = () => {
  const { accessToken } = useContext(AppContext);

  return async (fileId: string) => {
    const { metadata, data } = await downloadFile(accessToken.value, fileId);
    return { data, metadata };
  };
};

export const useDeleteFile = () => {
  const { accessToken } = useContext(AppContext);

  return async (fileId: string) => {
    await deleteFile(accessToken.value, fileId);
    await revalidateListFiles();
  };
};

export const useAppData = () => {
  const { accessToken } = useContext(AppContext);
  return useSWR('appData', () => loadAppData(accessToken.value));
};

export const useSaveAppData = () => {
  const { accessToken } = useContext(AppContext);

  return async (passphrase: string) => {
    const encryptionKey = await generateEncryptionKey();
    const appData = await wrapEncryptionKey(encryptionKey, passphrase);
    await saveAppData(accessToken.value, appData);
  };
};

// only for debug
export const useDeleteAppDataFolder = () => {
  const { accessToken } = useContext(AppContext);
  return () => deleteAppFolder(accessToken.value);
};
