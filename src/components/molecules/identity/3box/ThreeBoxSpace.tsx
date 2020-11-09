import {
  Box, Button, Heading, Text,
} from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import ThreeBoxSecret from './ThreeBoxSecret';
import ThreeBoxPublic from './ThreeBoxPublic';

export const SPACE_NAME = 'the-ledger-academy';

const ThreeBoxSpace = ({ box }: {box: any}) => {
  const [space, setSpace] = useState<any>();

  const openSpace = async () => {
    const _space = await box.openSpace(SPACE_NAME);
    await _space.syncDone;
    setSpace(_space);
  };

  return (
    <Box>
        <Heading size="md" my={2}>Space </Heading>

        {space
          ? <Box>
              <ThreeBoxPublic space={space} />
              <ThreeBoxSecret space={space} />
            </Box>
          : <Button variantColor="teal" onClick={openSpace}>open {SPACE_NAME} space</Button>
        }
    </Box>
  );
};

export default ThreeBoxSpace;
