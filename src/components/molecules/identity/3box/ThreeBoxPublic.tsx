import { Button, Text } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import { InputBase } from 'components/atoms/InputFlex';

const ThreeBoxPublic = ({ space }: { space: any }) => {
  const [randomValue, setRandomValue] = useState<number>();

  const updateRandomValue = async () => {
    const rand = Math.random();
    await space.public.set('random-value', rand);
    setRandomValue(rand);
  };

  useEffect(() => {
    if (!space) return;
    (async () => {
      setRandomValue(await space.public.get('random-value'));
    })();
  }, [space]);

  return (
    <InputBase align="center">
      <Text>Random Value: <b>{randomValue}</b></Text>
      <Button onClick={updateRandomValue}>store a public random value</Button>
    </InputBase>

  );
};

export default ThreeBoxPublic;
