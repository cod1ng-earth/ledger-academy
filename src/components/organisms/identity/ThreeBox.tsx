import {
  Alert, AlertDescription, AlertTitle, Box,
} from '@chakra-ui/core';
import { useWeb3React } from '@web3-react/core';
import LoginWith3Box from 'components/atoms/LoginWith3box';
import Web3Alert from 'components/atoms/Web3Alert';
import ThreeBoxProfile from 'components/molecules/identity/3box/ThreeBoxProfile';
import ThreeBoxSpace from 'components/molecules/identity/3box/ThreeBoxSpace';
import React, { useState } from 'react';
import Web3 from 'web3';

const ThreeBox = () => {
  const [box, setBox] = useState<any>();

  const {
    active: web3Active,
  } = useWeb3React<Web3>();

  return !web3Active
    ? <Web3Alert />
    : <Box my="6" w="100%">
      {box
        ? <>
          <Alert status="success" mb="6">
            <AlertTitle mr={2}>3box connected!</AlertTitle>
            <AlertDescription>{box.DID}</AlertDescription>
          </Alert>

          <ThreeBoxProfile box={box} />
          <ThreeBoxSpace box={box} />
        </>
        : <LoginWith3Box setBox={setBox} />
      }
    </Box>;
};

export default ThreeBox;
