import React, { useEffect, useState } from 'react';
// import IdentityWallet from 'identity-wallet'
import Ceramic from '@ceramicnetwork/ceramic-core';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { box, randomBytes, BoxKeyPair } from 'tweetnacl';
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64,
} from 'tweetnacl-util';
import { useIPFS } from './context/IPFS';

const newNonce = () => randomBytes(box.nonceLength);

export const encrypt = (
  secretOrSharedKey: Uint8Array,
  json: any,
  key?: Uint8Array,
): string => {
  const nonce = newNonce();
  const messageUint8 = decodeUTF8(JSON.stringify(json));
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
  return JSON.parse(base64DecryptedMessage);
};

const IdentityPage:React.FC<unknown> = () => {
  const [myKeypair, setMyKeypair] = useState<BoxKeyPair>();
  const [theirKeypair, setTheirKeypair] = useState<BoxKeyPair>();
  const [cipher, setCipher] = useState<string>();

  const ipfs = useIPFS();
  const { library, account } = useWeb3React();
  const web3 = library as Web3;

  const deriveKeys = (signature: string): BoxKeyPair => {
    const signatureBytes = new Uint8Array(web3.utils.hexToBytes(signature));
    const privateKey = signatureBytes.slice(0, 32);
    return box.keyPair.fromSecretKey(privateKey);
  };

  const connect = async (_account: string) => {
    const signature = await web3.eth.personal.sign('create your keypair', _account, '');

    const keypair = deriveKeys(signature);
    setMyKeypair(keypair);

    // const ceramic = await Ceramic.create(ipfs); // { '/ceramic/' }
    // IdentityWallet.create();
  };
  const doEncrypt = (evt) => {
    evt.preventDefault();
    if (!theirKeypair || !myKeypair) {
      return false;
    }
    const message = evt.currentTarget.message.value;
    const sharedKey = box.before(theirKeypair.publicKey, myKeypair.secretKey);
    const encrypted = encrypt(sharedKey, { text: message });
    console.log(encrypted);

    setCipher(encrypted);
  };

  const doDecrypt = (evt) => {
    evt.preventDefault();
    if (!theirKeypair || !myKeypair) {
      return false;
    }
    const cipherText = evt.currentTarget.cipherText.value;
    const sharedKey = box.before(myKeypair.publicKey, theirKeypair.secretKey);
    const decrypted = decrypt(sharedKey, cipherText);

    console.log(decrypted);
  };

  return (
    <div>
      <h1>identity</h1>

      {
          account
          && <button type="button" onClick={() => connect(account)}>connect</button>
      }
      <button type="button" onClick={() => { setTheirKeypair(box.keyPair()); }}>
        create their keypair
      </button>

      {myKeypair
            && (
              <p>
                my public key is:
                {' '}
                {myKeypair.publicKey}
              </p>
            )}
      {theirKeypair
            && (
            <p>
              their public key is:
              {' '}
              {theirKeypair.publicKey}
            </p>
            )}
      {
            (myKeypair && theirKeypair)
            && (
            <div>
              <form onSubmit={doEncrypt}>
                <input type="text" placeholder="message" name="message" />
                <button type="submit">encrypt</button>
              </form>
              <p>
                Cipher:
                {' '}
                {cipher}
              </p>
              <form onSubmit={doDecrypt}>
                <input type="text" placeholder="cipherText" name="cipherText" />
                <button type="submit">decrypt</button>
              </form>
            </div>
            )
        }

    </div>
  );
};

export default IdentityPage;
