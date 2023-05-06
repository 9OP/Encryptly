export interface UserInfo {
  email: string;
}

export interface StorageQuota {
  limit: number;
  usage: number;
  usageInDrive: number;
}

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  createdTime: Date;
  mimeType: string;
}

export interface WrappedKey {
  enc: string;
  salt: number[];
}

export interface AppData {
  encryptionKey: WrappedKey;
}
