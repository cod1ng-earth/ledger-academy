import { useWeb3React } from '@web3-react/core';
import React, { useState } from 'react';
import { box, BoxKeyPair } from 'tweetnacl';

import Web3 from 'web3';
import * as Encryption from 'modules/encryption';
import {
  Box, Button, Text, Flex, FormControl, FormLabel, IconButton, Input, FormHelperText, Alert, useClipboard,
} from '@chakra-ui/core';

const EncryptionForm = ({ myKeypair, theirKeypair, onDecrypted } :
  {
    myKeypair: BoxKeyPair,
    theirKeypair: BoxKeyPair,
    onDecrypted: (s: string) => void
  }) => {
  const [cipher, setCipher] = useState<string>();
  const { onCopy } = useClipboard(cipher);

  function doEncrypt(evt: any) {
    evt.preventDefault();
    const message = evt.currentTarget.message.value;
    const sharedKey = box.before(theirKeypair.publicKey, myKeypair.secretKey);
    const encrypted = Encryption.encrypt(sharedKey, message);
    console.log(encrypted);

    setCipher(encrypted);
  }

  function doDecrypt(evt: any) {
    evt.preventDefault();
    const cipherText = evt.currentTarget.cipherText.value;
    const sharedKey = box.before(myKeypair.publicKey, theirKeypair.secretKey);
    const _decrypted: any = Encryption.decrypt(sharedKey, cipherText);
    onDecrypted(_decrypted);
  }

  return <Box>
      <form onSubmit={doEncrypt}>
        <FormControl>
            <FormLabel htmlFor="message" >Message</FormLabel>
            <Input
              type="text" name="message"
            />
            <FormHelperText>
              the message to encrypt
            </FormHelperText>
        </FormControl>
        <Button variantColor="teal" type="submit">encrypt</Button>
      </form>
      {cipher && <Box>
        <Alert color="teal">
          <Box mr="2">
            <Text>Cipher:</Text>
          </Box>
          <Text as="em"> {cipher}</Text>
          <IconButton variantColor="teal" mx="2" aria-label="Copy cypher" icon="copy" onClick={onCopy}/>
        </Alert>
        <form onSubmit={doDecrypt}>
        <FormControl>
            <FormLabel htmlFor="cipher" >Cipher</FormLabel>
            <Input
              type="text" name="cipherText"
            />
            <FormHelperText>
              the cipher to decrypt
            </FormHelperText>
          </FormControl>
          <Button variantColor="teal" type="submit">decrypt</Button>
        </form>
        </Box>
      }
    </Box>;
};

const KeyPair = ({ keypair, label }: {keypair: BoxKeyPair, label: string}) => (
  <Flex>
    <Text p="6" fontWeight="bold">{label}</Text>
    <Text p="6">{keypair.publicKey}</Text>
  </Flex>
);

const NaclEncryption: React.FC<unknown> = () => {
  const [myKeypair, setMyKeypair] = useState<BoxKeyPair>();
  const [theirKeypair, setTheirKeypair] = useState<BoxKeyPair>();
  const [decrypted, setDecrypted] = useState<string>();

  const { library, account } = useWeb3React();
  const web3 = library as Web3;

  const deriveMyKeypair = async (_account: string) => {
    const signature = await web3.eth.personal.sign('create your keypair', _account, '');
    const signatureBytes = new Uint8Array(web3.utils.hexToBytes(signature));
    const keypair = Encryption.deriveKeys(signatureBytes);
    setMyKeypair(keypair);

    // const ceramic = await Ceramic.create(ipfs); // { '/ceramic/' }
    // IdentityWallet.create();
  };

  return (
    <Box>
      {
          account
          && <Button onClick={() => deriveMyKeypair(account)}>derive my keypair</Button>
      }
      <Button type="button" onClick={() => { setTheirKeypair(box.keyPair()); }}>
        create a random keypair
      </Button>

    {myKeypair && <KeyPair keypair={myKeypair} label="my key" /> }
    {theirKeypair && <KeyPair keypair={theirKeypair} label = "their key" />}

    {(myKeypair && theirKeypair)
    && (
      <EncryptionForm myKeypair={myKeypair} theirKeypair={theirKeypair} onDecrypted={setDecrypted} />
    )
    }
    { decrypted && <Alert>{decrypted}</Alert> }
    </Box>
  );
};

export default NaclEncryption;
