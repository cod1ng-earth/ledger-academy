import {
  Button, Input, InputGroup, InputRightElement,
} from '@chakra-ui/core';
import { InputBase } from 'components/atoms/InputFlex';
import React, { useEffect, useState } from 'react';

const ThreeBoxProfile = ({ box }: { box: any }) => {
  const [profile, setProfile] = useState<any>();
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const updateName = async (newName: string) => {
    setLoading(true);
    await box.public.set('name', newName);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const _profile = await box.public.all();
      setProfile(_profile);
      setName(_profile.name);
    })();
  }, []);

  return <InputBase >
    <InputGroup size="md" w="100%">
      <Input
        onChange={(e: any) => setName(e.target.value)}
        value={name}
        name="name"
        type="text"
        placeholder="Set your name"
        isDisabled={loading}
      />
      <InputRightElement width="7rem" mr="2">
        <Button variantColor="blue"
          isLoading={loading}
          loadingText="Submitting"
          h="1.75rem"
          size="sm"
          type="submit"
          onClick={() => updateName(name)}
        >
          change name
        </Button>
      </InputRightElement>

    </InputGroup>
  </InputBase>;
};

export default ThreeBoxProfile;
