import React, { useState } from 'react';
import {
  InputGroup, Input, InputRightElement, Button,
} from '@chakra-ui/core';

const NewMessageForm = ({ onSubmitted }: {onSubmitted: Function}) => {
  const [message, setMessage] = useState<string>('');

  function onSubmit(e: any) {
    e.preventDefault();
    onSubmitted(message);
    setMessage('');
  }

  return <form onSubmit={onSubmit}>
       <InputGroup size="md">
       <Input
            name="Message"
            onChange={(e: any) => setMessage(e.target.value)} value={message}
            type="text"
            placeholder="New Message"
          />
            <InputRightElement width="6.5rem">
              <Button h="1.75rem" size="sm" type="submit">
              send
              </Button>
            </InputRightElement>
          </InputGroup>
      </form>;
};

export default NewMessageForm;
