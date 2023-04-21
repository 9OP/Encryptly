import { decrypt, importEncryptionKey } from "@app/lib/crypto";

self.onmessage = async function (e) {
  try {
    const { data, key }: { data: Blob; key: string } = e.data;
    const importKey = await importEncryptionKey(key);
    const decrypted = await decrypt(data, importKey);
    self.postMessage(decrypted);
  } catch (err) {
    self.reportError(err);
  }
};
