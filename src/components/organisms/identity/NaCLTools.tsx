import React from 'react';
import { Flex, Box, Heading } from '@chakra-ui/core';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import NaclEncryption from './NaclEncryption';
import SignForm from '../../molecules/identity/SignForm';
import VerifyForm from '../../molecules/identity/VerifyForm';

const NaCLTools = () => {
  const {
    account, library: web3,
  } = useWeb3React<Web3>();

  return <Flex direction="column">
        <Box my="6">
            <Heading>TweetNacl</Heading>
            <NaclEncryption />
        </Box>
        {account && web3
        && <Box>
            <Heading>Sign &amp; Verify on Eth</Heading>
            <SignForm web3={web3} account={account} />
            <VerifyForm web3={web3} account={account} />
        </Box>
        }
    </Flex>;
};

export default NaCLTools;
