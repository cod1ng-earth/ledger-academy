import {
  Box, Button, Flex, Heading,
} from '@chakra-ui/core';
import { useWeb3React } from '@web3-react/core';
import { injected } from 'modules/connectors';
import React from 'react';
import Web3 from 'web3';
import MainMenu from './MainMenu';
import Navigation from './Navigation';

const Header = () => {
  const { activate, active: web3Active } = useWeb3React<Web3>();

  const onLogin = () => {
    activate(injected, console.error);
  };

  return (
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg="black"
        color="white"

      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg">
            L
          </Heading>
        </Flex>

        <Box
          display={{ sm: 'none', md: 'flex' }}
          width={{ sm: 'full', md: 'auto' }}
          alignItems="center"
          flexGrow={1}
        >
            <MainMenu as={React.Fragment} />
        </Box>

        <Box
          mt={{ base: 4, md: 0 }}
        >
          {!web3Active && <Button bg="transparent" border="1px" onClick={onLogin}>
            Login
          </Button>}
          <Navigation />
        </Box>
      </Flex>
  );
};

export default Header;
