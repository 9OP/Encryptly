import { useCallback, useContext } from "react";
import useSWR, { mutate } from "swr";
import { AppContext } from "@app/context";
import { generateEncryptionKey, wrapEncryptionKey } from "@app/lib/crypto";
import {
  getUserInfo,
  revokeToken,
  saveAppData,
  loadAppData,
  getUserFiles,
  getStorageQuota,
  deleteAppFolder,
  downloadFile,
  moveFile,
} from "./http";
import promisify from "@app/lib/promisify";

export const useIsAuthenticated = () => {
  const { accessToken, encryptionKey } = useContext(AppContext);
  const hasAccessToken = accessToken.value != "" && accessToken.value != null;
  const hasEncryptionKey =
    encryptionKey.value != "" && encryptionKey.value != null;
  return hasAccessToken && hasEncryptionKey;
};

export const useUserInfo = () => {
  const { accessToken } = useContext(AppContext);
  return useSWR("UserInfo", () => getUserInfo(accessToken.value));
};

export const useLogout = () => {
  const { accessToken, encryptionKey } = useContext(AppContext);

  return async () => {
    sessionStorage.clear();
    encryptionKey.setValue("");
    await revokeToken(accessToken.value);
    accessToken.setValue("");

    // Clear all previous, to force refetch new data with new token/user
    await mutate(() => true, undefined, {
      revalidate: true,
      populateCache: true,
    });
  };
};

export const useDriveQuota = () => {
  const { accessToken } = useContext(AppContext);
  return useSWR("driveQuota", () => getStorageQuota(accessToken.value));
};

export const useListFiles = () => {
  const { accessToken } = useContext(AppContext);
  return useSWR("listFiles", () => getUserFiles(accessToken.value));
};

export const revalidateListFiles = async () => {
  await mutate((key: string) => "listFiles" == key, undefined, {
    revalidate: true,
    populateCache: false,
  });
};

export const useEncryptFile = () => {
  const { encryptionKey } = useContext(AppContext);

  return useCallback(
    (file: File): Promise<Blob> => {
      const worker = new Worker(
        new URL("@app/lib/webworkers/encrypt.worker.ts", import.meta.url)
      );
      return promisify(worker, { file, key: encryptionKey.value });
    },
    [encryptionKey.value]
  );
};

export const useDecryptFile = () => {
  const { encryptionKey } = useContext(AppContext);

  return useCallback(
    (data: Blob): Promise<Blob> => {
      const worker = new Worker(
        new URL("@app/lib/webworkers/decrypt.worker.ts", import.meta.url)
      );
      return promisify(worker, { data, key: encryptionKey.value });
    },
    [encryptionKey.value]
  );
};

// export const useCreateFolder = () => {
//   const { accessToken, currentFolder } = useContext(AppContext);

//   return async (name: string) => {
//     const res = await createFolder(accessToken.value, name, currentFolder.value || "root");
//     await revalidateListFiles();
//     return res;
//   };
// };

export const useMoveFile = () => {
  const { accessToken } = useContext(AppContext);

  return async (fileId: string, parentId: string) => {
    const res = await moveFile(accessToken.value, fileId, parentId);
    await revalidateListFiles();
    return res;
  };
};

// export const useUploadFile = () => {
//   const { accessToken, currentFolder } = useContext(AppContext);

//   return async (file: { data: Blob; name: string }) => {
//     const generator = await uploadFile(
//       accessToken.value,
//       currentFolder.value,
//       file.name,
//       file.data
//     );
//     return generator;
//   };
// };

export const useDownloadFile = () => {
  const { accessToken } = useContext(AppContext);

  return async (fileId: string) => {
    const { metadata, data } = await downloadFile(accessToken.value, fileId);
    return { data, metadata };
  };
};

export const useAppData = () => {
  const { accessToken } = useContext(AppContext);
  return useSWR("appData", () => loadAppData(accessToken.value));
};

export const useSaveAppData = () => {
  const { accessToken } = useContext(AppContext);

  return async (passphrase: string) => {
    const encryptionKey = await generateEncryptionKey();
    const appData = await wrapEncryptionKey(encryptionKey, passphrase);
    await saveAppData(accessToken.value, appData);
  };
};

export const useDeleteAppDataFolder = () => {
  const { accessToken } = useContext(AppContext);
  return () => deleteAppFolder(accessToken.value);
};
