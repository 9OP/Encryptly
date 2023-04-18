export interface UserInfo {
  email: string;
}

export interface StorageQuota {
  limit: number;
  usage: number;
  usageInDrive: number;
  usageInDriveTrash: number;
}

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  createdTime: Date;
  mimeType: string;
  fileExtension: string;
}

export interface AppData {
  key: string;
  salt: number[];
}

// export interface AppData {
//   encryptionKey: {
//     key: string;
//     salt: number[];
//   };
// }
