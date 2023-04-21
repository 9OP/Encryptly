import { AppData } from "@app/models";

// Recommended nonce byte lenght for AES-GCM 256bytes
const NONCE_SIZE = 12;
// Store a 1 byte VERSION flag in
// for backward compatibility
const VERSION = new Uint8Array([0x01]);
const VERSION_SIZE = 1;

function compare(a: Uint8Array, b: Uint8Array) {
  for (let i = a.length; -1 < i; i -= 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export const decrypt = async (data: Blob, key: CryptoKey): Promise<Blob> => {
  const buff = await data.arrayBuffer();
  const version = buff.slice(0, VERSION_SIZE);
  const iv = buff.slice(VERSION_SIZE, NONCE_SIZE);
  const cipher = buff.slice(NONCE_SIZE);

  if (!compare(VERSION, new Uint8Array(version))) {
    throw new Error("File version not recognized");
  }

  const decrypted = await self.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    cipher
  );
  return new Blob([decrypted]);
};

export const encrypt = async (data: Blob, key: CryptoKey): Promise<Blob> => {
  const iv = self.crypto.getRandomValues(new Uint8Array(NONCE_SIZE));
  const plain = await data.arrayBuffer();
  const encrypted = await self.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plain
  );
  return new Blob([VERSION.buffer, iv.buffer, encrypted]);
};

export const generateEncryptionKey = async () => {
  const key = await self.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  return key;
};

const getKeyMaterial = async (passphrase: string): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  return self.crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
};

const getWrapKey = async (keyMaterial: CryptoKey, salt: Uint8Array) => {
  return self.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-KW", length: 256 },
    true,
    ["wrapKey", "unwrapKey"]
  );
};

export const wrapEncryptionKey = async (
  encryptionKey: CryptoKey,
  passphrase: string
): Promise<AppData> => {
  const keyMaterial = await getKeyMaterial(passphrase);
  const salt = self.crypto.getRandomValues(new Uint8Array(16));
  const wrapKey = await getWrapKey(keyMaterial, salt);
  const key = await self.crypto.subtle.wrapKey(
    "raw",
    encryptionKey,
    wrapKey,
    "AES-KW"
  );
  return {
    key: toB64(key),
    salt: [...salt],
  };
};

export const unwrapEncryptionKey = async (
  appData: AppData,
  passphrase: string
): Promise<CryptoKey> => {
  const salt = new Uint8Array(appData.salt);
  const keyMaterial = await getKeyMaterial(passphrase);
  const wrapKey = await getWrapKey(keyMaterial, salt);
  return self.crypto.subtle.unwrapKey(
    "raw",
    fromB64(appData.key),
    wrapKey,
    "AES-KW",
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
};

export const exportEncryptionKey = async (
  encryptionKey: CryptoKey
): Promise<string> => {
  return toB64(await self.crypto.subtle.exportKey("raw", encryptionKey));
};

export const importEncryptionKey = async (
  encryptionKey: string
): Promise<CryptoKey> => {
  return self.crypto.subtle.importKey(
    "raw",
    fromB64(encryptionKey),
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
};

export const sha256 = async (str: string): Promise<string> => {
  const digest = await self.crypto.subtle.digest("SHA-512", fromB64(str));
  return toB64(digest);
};

const toB64 = (buf: ArrayBuffer): string => {
  return self.btoa(
    new Uint8Array(buf).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
};

const fromB64 = (buf: string): ArrayBuffer => {
  return new Uint8Array(
    [...self.atob(buf)].reduce(
      (data, char) => data.concat([char.charCodeAt(0)]),
      [] as number[]
    )
  ).buffer;
};
