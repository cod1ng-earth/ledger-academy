import { Alert, Box, Flex } from '@chakra-ui/core';
import { useWeb3React } from '@web3-react/core';
import Change3BoxProfile from 'components/molecules/identity/Change3BoxProfile';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import LoginWith3Box from 'components/atoms/LoginWith3box';

const ThreeBox = () => {
  const [profile, setProfile] = useState<any>();
  const [box, setBox] = useState<any>();

  const {
    active: web3Active, error: web3Error,
  } = useWeb3React<Web3>();

  useEffect(() => {
    if (!box) return;

    (async () => {
      const _profile = await box.public.all();
      console.log(_profile);
      setProfile(_profile);
    })();
  }, [box]);

  return <Flex>
      {(!web3Active)
        ? <Alert>enable web3 please {web3Error} </Alert>
        : <Box my="6">
            {box
              ? profile && <Change3BoxProfile name={profile.name} box={box} />
              : <LoginWith3Box setBox={setBox} />
            }
          </Box>
      }
    </Flex>;
};

export default ThreeBox;
