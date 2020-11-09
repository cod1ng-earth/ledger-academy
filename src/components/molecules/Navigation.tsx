import {
  Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, ListItem, useDisclosure,
} from '@chakra-ui/core';
import React from 'react';
import { useWeb3React } from '@web3-react/core';
import Blockie from 'components/atoms/Blockie';
import MainMenu from './MainMenu';

const Navigation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account } = useWeb3React();

  return (
    <>
      <Button onClick={onOpen} background="black">
          {account ? <Blockie address={account} /> : <svg
            fill="white"
            width="12px"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>}
      </Button>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Drawer.</DrawerHeader>

          <DrawerBody>
            <MainMenu as={ListItem} />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button color="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navigation;
