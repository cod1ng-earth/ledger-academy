import { box, randomBytes, BoxKeyPair } from 'tweetnacl';
import {
  decodeBase64, decodeUTF8,
  encodeBase64, encodeUTF8,
} from 'tweetnacl-util';

const newNonce = () => randomBytes(box.nonceLength);

export const deriveKeys = (seedBytes: Uint8Array): BoxKeyPair => {
  const privateKey = seedBytes.slice(0, 32);
  return box.keyPair.fromSecretKey(privateKey);
};

export const encrypt = (
  secretOrSharedKey: Uint8Array,
  message: string,
  key?: Uint8Array,
): string => {
  const nonce = newNonce();
  const messageUint8 = decodeUTF8(message);
  const encrypted = key
    ? box(messageUint8, nonce, key, secretOrSharedKey)
    : box.after(messageUint8, nonce, secretOrSharedKey);

  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);

  const base64FullMessage = encodeBase64(fullMessage);
  return base64FullMessage;
};

export const decrypt = (
  secretOrSharedKey: Uint8Array,
  messageWithNonce: string,
  key?: Uint8Array,
): string => {
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
  const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(
    box.nonceLength,
    messageWithNonce.length,
  );

  const decrypted = key
    ? box.open(message, nonce, key, secretOrSharedKey)
    : box.open.after(message, nonce, secretOrSharedKey);

  if (!decrypted) {
    throw new Error('Could not decrypt message');
  }

  const base64DecryptedMessage = encodeUTF8(decrypted);
  return base64DecryptedMessage;
};
