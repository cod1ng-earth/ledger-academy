import * as TBox from '3box';
import {
  Box, Flex, InputGroup, Input, InputRightElement, Button, Alert,
} from '@chakra-ui/core';
import { useWeb3React } from '@web3-react/core';
import { useIPFS } from 'context/IPFS';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

interface ChangeDetailsProps {
    name: string,
    box: any,
}

const ChangeDetails = (props: ChangeDetailsProps) => {
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

const ThreeBoxTools = () => {
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>();
  const [box, setBox] = useState<any>();

  const { ipfsNode } = useIPFS();
  const {
    account, library: web3, active: web3Active, error: web3Error,
  } = useWeb3React<Web3>();

  const loginWith3box = async () => {
    setIsLoggingIn(true);
    const _box = await TBox.openBox(account, web3?.currentProvider, {
      ipfs: ipfsNode,
      consentCallback: (val: any) => console.log('consent', val),
    });
    setBox(_box);
    setIsLoggingIn(false);
  };

  useEffect(() => {
    if (!box) return;

    (async () => {
      const _profile = await box.public.all();
      console.log(_profile);
      setProfile(_profile);
    })();
  }, [box]);

  return <Flex>
      {(!web3Active) ? <Alert>enable web3 please {web3Error} </Alert>
        : <Box my="6">
      {profile
        ? <ChangeDetails name={profile.name} box={box} />
        : <Button variantColor="blue"
          loadingText="logging in"
          isLoading={isLoggingIn}
          onClick={loginWith3box}>
          Login with 3box
        </Button>
      }
      </Box>
      }
    </Flex>;
};

export default ThreeBoxTools;