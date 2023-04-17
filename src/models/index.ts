export interface UserInfo {
  email: string;
  name: string;
  picture: string;
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
  kind: "FILE" | "FOLDER";
  size: number;
  createdTime: Date;
  mimeType: string;
  parents: string[];
  trashed: boolean;
  fileExtension: string;
}

export const getFolderTree = (
  rootId: string,
  folderId: string,
  files: FileMetadata[]
): string[] => {
  const tree: string[] = [];

  while (folderId != rootId) {
    tree.push(folderId);
    folderId = files.find((f) => f.id === folderId)?.parents[0] || rootId;
  }
  tree.push(rootId);

  return tree.reverse();
};

export const getChildren = (
  rootId: string,
  parentId: string,
  files: FileMetadata[]
): FileMetadata[] => {
  let res = files.filter((file) => file.parents.includes(parentId));
  if (parentId === rootId) {
    // Add all the files with unknown parentId
    const ids = new Set([rootId, ...files.reduce((acc, f) => acc.concat(f.id), [] as string[])]);
    res = res.concat(files.filter((f) => !ids.has(f.parents[0])));
  }
  return res;
};

export interface AppData {
  key: string;
  salt: number[];
}
