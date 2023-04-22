import * as JSzip from "jszip";

export const saveFile = (
  fileData: BlobPart[],
  name: string,
  type: string,
  ref: React.RefObject<HTMLAnchorElement>
) => {
  const file = new File(fileData, name, {
    type,
  });
  const objectUrl = URL.createObjectURL(file);

  if (ref.current) {
    ref.current.href = objectUrl;
    ref.current.download = name;
    ref.current.click();
  }
};

export const handleDataItem = async (items: DataTransferItem[]) => {
  const files: File[] = [];

  for (var i = 0; i < items.length; i++) {
    const item = items[0].webkitGetAsEntry();

    if (!item) {
      continue;
    }

    switch (true) {
      case item.isFile:
        const file = await getFile(item as FileSystemFileEntry);
        files.push(file);
        break;

      case item.isDirectory:
        const tree: File[] = [];
        await traverseFileTree(item as FileSystemDirectoryEntry, "", tree);
        let zip = new JSzip();
        console.log("tree", tree);
        for (var i = 0; i < tree.length; i++) {
          const file = tree[i];
          console.log(file);
          zip.file(file.name, file);
        }
        console.log("zip", zip);
        const archive = await zip.generateAsync({
          type: "blob",
          platform: window.navigator.platform.toLowerCase().includes("win") ? "DOS" : "UNIX",
        });
        files.push(new File([archive], item.name + ".zip", { type: "application/zip" }));
        break;

      default:
        break;
    }
  }

  return files;
};

const getFile = async (fileEntry: FileSystemFileEntry): Promise<File> => {
  return new Promise((resolve, reject) => fileEntry.file(resolve, reject));
};

const traverseFileTree = async (
  item: FileSystemFileEntry | FileSystemDirectoryEntry | FileSystemEntry,
  path: string,
  acc: File[]
) => {
  path = path || "";

  switch (true) {
    case item.isFile:
      const file = await getFile(item as FileSystemFileEntry);
      acc.push(new File([file], path + file.name, { type: file.type }));
      return;

    case item.isDirectory:
      const dirReader = (item as FileSystemDirectoryEntry).createReader();
      const entries = await readEntries(dirReader);
      for (var entry of entries) {
        await traverseFileTree(entry, path + item.name + "/", acc);
      }
      return;

    default:
      return;
  }
};

const readEntries = (reader: FileSystemDirectoryReader): Promise<FileSystemEntry[]> => {
  return new Promise((resolve, reject) => {
    reader.readEntries((entries) => {
      resolve(entries);
    });
  });
};
