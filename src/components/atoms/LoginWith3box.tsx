import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useIPFS } from 'context/IPFS';
import * as TBox from '3box';
import Web3 from 'web3';
import { Button, Box } from '@chakra-ui/core';

const LoginWith3Box = ({ setBox }: {setBox: Function}) => {
  const {
    account, library: web3,
  } = useWeb3React<Web3>();
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const { ipfsNode } = useIPFS();

  const loginWith3box = async () => {
    setIsLoggingIn(true);

    const box = await TBox.create(web3?.currentProvider, {
      ipfs: ipfsNode,
      iframeCache: false,
    });

    await box.auth([], {
      address: account,
      provider: web3?.currentProvider,
      consentCallback: (val: any) => console.log('consent', val),
    });

    setBox(box);
    setIsLoggingIn(false);
  };

  return <Button variantColor="blue"
      loadingText="logging in"
      isLoading={isLoggingIn}
      onClick={loginWith3box}>
      Login with 3box
    </Button>;
};

export default LoginWith3Box;
