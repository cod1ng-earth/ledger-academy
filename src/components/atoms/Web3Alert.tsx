import React from 'react';
import {
  Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton,
} from '@chakra-ui/core';

const Web3Alert: React.FC<any> = () => (
        <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>web3 is not enabled!</AlertTitle>
            <AlertDescription>Connect your Metamask.</AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" />
        </Alert>
);

export default Web3Alert;
