import { AppData, FileMetadata, StorageQuota, UserInfo } from "../models";

const JSONtoUserInfo = (json: any): UserInfo => {
  const userInfo: UserInfo = {
    email: json["emailAddress"],
  };
  return userInfo;
};

const JSONtoFileMetadata = (json: any): FileMetadata => {
  const fileMetadata: FileMetadata = {
    id: json["id"],
    name: json["name"],
    size: parseInt(json["size"] || 0),
    createdTime: new Date(json["createdTime"]),
    mimeType: json["mimeType"],
    fileExtension: json["fileExtension"],
  };
  return fileMetadata;
};

const JSONtoFilesMetadata = (json: any): FileMetadata[] => {
  return json
    .map((file: any): FileMetadata | undefined => {
      if (file["trashed"] === true) {
        return;
      }
      return JSONtoFileMetadata(file);
    })
    .filter((e: any) => e != null)
    .sort((a: FileMetadata, b: FileMetadata) =>
      a.createdTime && b.createdTime ? a.createdTime > b.createdTime : 0
    );
};

const JSONtoAppData = (json: any): AppData => {
  const appData: AppData = {
    key: json["key"],
    salt: json["salt"],
  };
  return appData;
};

const JSONtoStorageQuota = (json: any): StorageQuota => {
  const storageQuota: StorageQuota = {
    limit: parseInt(json["limit"]),
    usage: parseInt(json["usage"]),
    usageInDrive: parseInt(json["usageInDrive"]),
    usageInDriveTrash: parseInt(json["usageInDriveTrash"]),
  };
  return storageQuota;
};

export const getUserInfo = async (token: string): Promise<UserInfo> => {
  const res = await fetch("https://www.googleapis.com/drive/v3/about?fields=user", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();

  if (!res.ok) {
    const error = new Error("Failed fetching user.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return JSONtoUserInfo(json["user"]);
};

export const revokeToken = async (token: string): Promise<void> => {
  fetch(`https://oauth2.googleapis.com/revoke?token=${token}type=accesstoken`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

const CONFIG_FILE_NAME = "config.json";
const APP_DATA_FOLDER = "appDataFolder";

const createConfigFile = async (token: string): Promise<string> => {
  const res = await fetch("https://www.googleapis.com/drive/v3/files?fields=id", {
    method: "POST",
    body: JSON.stringify({
      mimeType: "application/json",
      parents: [APP_DATA_FOLDER],
      name: CONFIG_FILE_NAME,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const json = await res.json();
  return json["id"];
};

const uploadConfigFile = async (
  token: string,
  configFileId: string,
  data: AppData
): Promise<void> => {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  const file = new File([bytes], "config.json", { type: "application/json" });

  await fetch(`https://www.googleapis.com/upload/drive/v3/files/${configFileId}?uploadType=media`, {
    method: "PATCH",
    body: file,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const saveAppData = async (token: string, data: AppData): Promise<void> => {
  const configFileId = await createConfigFile(token);
  await uploadConfigFile(token, configFileId, data);
};

const getAppFiles = async (token: string) => {
  const res = await fetch(
    "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(*)",
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const json = await res.json();
  return JSONtoFilesMetadata(json["files"]);
};
const loadConfigFile = async (token: string, configFileId: string): Promise<AppData> => {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${configFileId}?spaces=appDataFolder&alt=media`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const json = await res.json();
  return JSONtoAppData(json);
};
export const loadAppData = async (token: string): Promise<AppData> => {
  const files = await getAppFiles(token);
  const configFile = files.find((f) => f.name == CONFIG_FILE_NAME);
  if (!configFile) {
    throw new Error(`Config file <${CONFIG_FILE_NAME}> not found`);
  }
  return await loadConfigFile(token, configFile.id);
};
export const deleteAppFolder = async (token: string): Promise<void> => {
  const files = await getAppFiles(token);
  const promises = files.map(({ id: fileId }) => {
    return fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  });
  await Promise.all(promises);
};

export const getStorageQuota = async (token: string): Promise<StorageQuota> => {
  const res = await fetch("https://www.googleapis.com/drive/v3/about?fields=storageQuota", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  return JSONtoStorageQuota(json["storageQuota"]);
};

export const getUserFiles = async (token: string): Promise<FileMetadata[]> => {
  const res = await fetch("https://www.googleapis.com/drive/v3/files?fields=*", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  return JSONtoFilesMetadata(json["files"]);
};

const uploadFileMetadata = async (token: string, name: string): Promise<string> => {
  // https://developers.google.com/drive/api/guides/manage-uploads#http_2
  const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable", {
    method: "POST",
    body: JSON.stringify({
      name: name,
      originalFilename: name,
      mimeType: "application/octet-stream", // "text/plain"
      description: "From encryptly",
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Type": "application/octet-stream",
    },
  });
  const location = res.headers.get("location");
  if (!res.ok || !location) {
    const error = new Error("Failed upload session resume.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return location;
};

interface Chunk {
  data: Blob;
  ratio: number;
  contentLength: string;
  contentRange: string;
}

const generateChunks = (data: Blob): Chunk[] => {
  /**
   *  Create chunks in multiples of 256 KB (256 x 1024 bytes) in size,
   *  except for the final chunk that completes the upload.
   *  Keep the chunk size as large as possible so that the upload is efficient.
   *
   *  Add headers:
   *  - Content-Length. Set to the number of bytes in the current chunk.
   *  - Content-Range. Set to show which bytes in the file you upload.
   *  For example, Content-Range: bytes 0-524287/2000000 shows that you
   *  upload the first 524,288 bytes (256 x 1024 x 2) in a 2,000,000 byte file.
   */
  const chunkSize = 256 * 1024 * 16;
  const dataSize = data.size;
  const chunks: Chunk[] = [];
  let chunkCount = 0;
  for (; (chunkCount + 1) * chunkSize < dataSize; chunkCount += 1) {
    const start = chunkSize * chunkCount;
    const end = chunkSize * (chunkCount + 1);
    const chunk: Chunk = {
      data: data.slice(start, end),
      ratio: (end / dataSize) * 100,
      contentLength: (end - start).toString(),
      contentRange: `bytes ${start}-${end - 1}/${dataSize}`,
    };
    chunks.push(chunk);
  }

  const start = chunkSize * chunkCount;
  const end = dataSize;
  const lastChunk: Chunk = {
    data: data.slice(start, end),
    ratio: 100,
    contentLength: (end - start).toString(),
    contentRange: `bytes ${start}-${end - 1}/${dataSize}`,
  };
  chunks.push(lastChunk);

  return chunks;
};

async function* uploadFileMedia(
  token: string,
  file: Blob,
  session: string
): AsyncGenerator<number, string, void> {
  // https://developers.google.com/drive/api/guides/manage-uploads#http---multiple-requests
  const chunks = generateChunks(file);

  for (const { data, ratio, contentLength, contentRange } of chunks) {
    await fetch(session, {
      method: "PUT",
      body: data,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Length": contentLength,
        "Content-Range": contentRange,
      },
    });
    yield ratio;
  }

  return "ok";
}

export const uploadFile = async (
  token: string,
  name: string,
  data: Blob
): Promise<AsyncGenerator<number, string, void>> => {
  const uploadSession = await uploadFileMetadata(token, name);
  return uploadFileMedia(token, data, uploadSession);
};

const downloadFileMedia = async (token: string, fileId: string): Promise<Blob> => {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.blob();
  return data;
};
const downloadFileMetadata = async (token: string, fileId: string): Promise<FileMetadata> => {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=*`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  const metadata = JSONtoFileMetadata(json);
  return metadata;
};
export const downloadFile = async (
  token: string,
  fileId: string
): Promise<{
  metadata: FileMetadata;
  data: Blob;
}> => {
  const data = await downloadFileMedia(token, fileId);
  const metadata = await downloadFileMetadata(token, fileId);
  return { metadata, data };
};

export const deleteFile = async (token: string, fileId: string): Promise<void> => {
  await fetch(`https://www.googleapis.com/drive/v2/files/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};
