import { encrypt, importEncryptionKey } from '@app/lib/crypto';

self.onmessage = async function (e) {
  try {
    const { file, key }: { file: File; key: string } = e.data;
    const importKey = await importEncryptionKey(key);
    const encrypted = await encrypt(file, importKey);
    self.postMessage(encrypted);
  } catch (err) {
    self.reportError(err);
  }
};
