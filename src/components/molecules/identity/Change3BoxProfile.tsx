import React, { useState } from 'react';
import {
  InputGroup, InputRightElement, Button, Input,
} from '@chakra-ui/core';

export interface ChangeDetailsProps {
    name: string,
    box: any,
}
const Change3BoxProfile = (props: ChangeDetailsProps) => {
  const [name, setName] = useState<string>(props.name || '');
  const [loading, setLoading] = useState<boolean>(false);

  const changeName = async (newName: string) => {
    setLoading(true);
    await props.box.public.set('name', newName);
    setLoading(false);
  };
  return <form onSubmit={(e) => { e.preventDefault(); changeName(name); } }>
      <InputGroup size="md">

        <Input
          onChange={(e: any) => setName(e.target.value)}
          value={name}
          name="name"
          type="text"
          placeholder="Set your name"
          isDisabled={loading}
        />
        <InputRightElement width="4.5rem" mr="1rem">
          <Button variantColor="blue"
              isLoading={loading}
              loadingText="Submitting"
              h="1.75rem"
              size="sm"
              type="submit"
          >
          change
          </Button>
        </InputRightElement>

      </InputGroup>
    </form>;
};

export default Change3BoxProfile;
