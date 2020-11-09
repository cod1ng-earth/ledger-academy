import {
  Button, Input, InputGroup, InputRightElement,
} from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import InputFlex from 'components/atoms/InputFlex';

const ThreeBoxSecret = ({ space }: {space: any}) => {
  const [secretValue, setSecretValue] = useState<string>('');

  const updateSecretValue = async () => {
    await space.private.set('secret-value', secretValue);
    setSecretValue(secretValue);
  };

  useEffect(() => {
    (async () => {
      const _storedSecret = await space.private.get('secret-value');
      setSecretValue(_storedSecret || '');
    })();
  }, []);

  return (<InputFlex >
    <InputGroup size="md" w="100%">
        <Input
        onChange={(e: any) => setSecretValue(e.target.value)}
        value={secretValue}
        name="name"
        type="text"
        placeholder="shhhhhh"
        />
        <InputRightElement width="10rem" mr="1.5rem">
        <Button variantColor="blue"
        onClick={updateSecretValue}
            loadingText="Submitting"
            h="1.75rem"
            size="sm"
            type="submit"
        >
        store a private secret
        </Button>
        </InputRightElement>
    </InputGroup>
  </InputFlex>);
};

export default ThreeBoxSecret;
