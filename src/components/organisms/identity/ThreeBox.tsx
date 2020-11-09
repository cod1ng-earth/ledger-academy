import { Alert, Box, Flex } from '@chakra-ui/core';
import { useWeb3React } from '@web3-react/core';
import LoginWith3Box from 'components/atoms/LoginWith3box';
import ThreeBoxProfile from 'components/molecules/identity/3box/ThreeBoxProfile';
import ThreeBoxSpace from 'components/molecules/identity/3box/ThreeBoxSpace';
import React, { useState } from 'react';
import Web3 from 'web3';

const ThreeBox = () => {
  const [box, setBox] = useState<any>();

  const {
    active: web3Active, error: web3Error,
  } = useWeb3React<Web3>();

  return <Flex>
      {(!web3Active)
        ? <Alert>enable web3 please {web3Error} </Alert>
        : <Box my="6" w="100%">
            {box
              ? <>
                  <ThreeBoxProfile box={box} />
                  <ThreeBoxSpace box={box} />
                </>
              : <LoginWith3Box setBox={setBox} />
            }
          </Box>
      }
    </Flex>;
};

export default ThreeBox;
