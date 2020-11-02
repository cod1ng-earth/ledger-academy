import {
  Alert, AlertDescription, AlertIcon, AlertTitle, Badge, Box, CloseButton, Flex, Text,
} from '@chakra-ui/core';
import React from 'react';
import Blockie from './Blockie';

const Web3Alert: React.FC<any> = () => (
        <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>web3 is not enabled!</AlertTitle>
            <AlertDescription>Connect your Metamask.</AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" />
        </Alert>
);

export const ConnectedAlert = ({ account, networkType }: {
  account: string,
  networkType: string
}) => (<Alert status="success" flexDirection="row" justifyContent="space-between">
      <Flex flexDirection="row" alignItems="center">
        <AlertTitle mr={2}>
          You&apos;re connected!
        </AlertTitle>
        <AlertDescription>
          <Flex align="center">
            <Blockie seed={account} mr="2" w="1rem" h="1rem" />
            <Text>{account}</Text>
          </Flex>
        </AlertDescription>
      </Flex>
      <Box>
          <Badge>{networkType}</Badge>
      </Box>
  </Alert>);
export default Web3Alert;
