import { encrypt, importEncryptionKey } from "../crypto";

self.onmessage = async function (e) {
  const { file, key }: { file: File; key: string } = e.data;
  const importKey = await importEncryptionKey(key);
  const encrypted = await encrypt(file, importKey);
  self.postMessage(encrypted);
};
