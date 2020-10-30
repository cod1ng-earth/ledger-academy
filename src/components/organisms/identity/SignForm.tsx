import {
  Alert, Box, Button, FormControl, FormHelperText, FormLabel, IconButton, Input, Text, useClipboard,
} from '@chakra-ui/core';
import React, { useState } from 'react';
import Web3 from 'web3';

const SignForm = ({ web3, account }: {web3: Web3, account: string}) => {
  const [message, setMessage] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const { onCopy } = useClipboard(signature);

  async function signMessage() {
    const signed = await web3!.eth.personal.sign(message, account!, '');
    setSignature(signed);
  }

  return (
    <Box>
      <FormControl>
        <FormLabel htmlFor="message" >Message</FormLabel>
        <Input
          type="text"
          value={message}
          name="message"
          onChange={(e: any) => setMessage(e.target.value)}
        />
        <FormHelperText>
          the message to sign
        </FormHelperText>
      </FormControl>
      <Button variantColor="teal" isDisabled={!message} onClick={signMessage}>sign</Button>

      {signature && <Alert color="teal">
        <Box mr="2">
          <Text>Signature:</Text>
        </Box>
        <Text as="em"> {signature}</Text>
        <IconButton variantColor="teal" mx="2" aria-label="Copy signature" icon="copy" onClick={onCopy} />
      </Alert>
      }
    </Box>
  );
};

export default SignForm;
