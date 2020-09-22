import { useWeb3React } from '@web3-react/core';
import React, { useState } from 'react';
import { box, BoxKeyPair } from 'tweetnacl';

import Web3 from 'web3';
import * as Encryption from 'modules/encryption';

const NaclIdentity:React.FC<unknown> = () => {
  const [myKeypair, setMyKeypair] = useState<BoxKeyPair>();
  const [theirKeypair, setTheirKeypair] = useState<BoxKeyPair>();
  const [cipher, setCipher] = useState<string>();

  const { library, account } = useWeb3React();
  const web3 = library as Web3;

  const deriveMyKeypair = async (_account: string) => {
    const signature = await web3.eth.personal.sign('create your keypair', _account, '');
    const signatureBytes = new Uint8Array(web3.utils.hexToBytes(signature))
    const keypair = Encryption.deriveKeys(signatureBytes);
    setMyKeypair(keypair);

    // const ceramic = await Ceramic.create(ipfs); // { '/ceramic/' }
    // IdentityWallet.create();
  };
  const doEncrypt = (evt: any) => {
    evt.preventDefault();
    if (!theirKeypair || !myKeypair) {
      return false;
    }
    const message = evt.currentTarget.message.value;
    const sharedKey = box.before(theirKeypair.publicKey, myKeypair.secretKey);
    const encrypted = Encryption.encrypt(sharedKey, { text: message });
    console.log(encrypted);

    setCipher(encrypted);
  };

  const doDecrypt = (evt: any) => {
    evt.preventDefault();
    if (!theirKeypair || !myKeypair) {
      return false;
    }
    const cipherText = evt.currentTarget.cipherText.value;
    const sharedKey = box.before(myKeypair.publicKey, theirKeypair.secretKey);
    const decrypted = Encryption.decrypt(sharedKey, cipherText);

    console.log(decrypted);
  };

  return (
    <div>

      {
          account
          && <button type="button" onClick={() => deriveMyKeypair(account)}>derive my keypair</button>
      }
      <button type="button" onClick={() => { setTheirKeypair(box.keyPair()); }}>
        create a random keypair
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

export default NaclIdentity;
