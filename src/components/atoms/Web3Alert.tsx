import {
  Alert, AlertDescription, AlertIcon, AlertTitle, Badge, Box, Button, CloseButton, Flex, Link, Text,
} from '@chakra-ui/core';
import { useWeb3React } from '@web3-react/core';
import { injected, walletconnect } from 'modules/connectors';
import React from 'react';
import Blockie from './Blockie';

const Web3Alert: React.FC<any> = () => {
  const { activate } = useWeb3React();

  const connect = (connector: any) => {
    activate(connector, console.error);
  };

  return <Alert status="error" my={2}>
    <AlertIcon />
    <AlertTitle mr={2}>web3 is not enabled!</AlertTitle>
    <AlertDescription >
      Connect with {' '}
      <Link onClick={() => connect(injected)}>Metamask</Link> or {' '}
      <Link onClick={() => connect(walletconnect)}>Wallet Connect</Link>
    </AlertDescription>
    <CloseButton position="absolute" right="8px" top="8px" />
  </Alert>;
};

export const ConnectedAlert = ({ account, networkType }: {
  account: string,
  networkType: string
}) => {
  const { deactivate } = useWeb3React();

  return <Alert status="success" flexDirection="row" justifyContent="space-between">
    <Flex flexDirection="row" alignItems="center">
      <AlertTitle mr={2}>
        You&apos;re connected!
      </AlertTitle>
      <AlertDescription>
        <Flex align="center">
          <Blockie address={account} mr="2" w="1rem" h="1rem" />
          <Text>{account}</Text>
          <Button size="sm" variant="link" mx={2} onClick={() => deactivate()}>Logout</Button>
        </Flex>
      </AlertDescription>
    </Flex>
    <Box>
      <Badge>{networkType}</Badge>
    </Box>
  </Alert >;
};
export default Web3Alert;
