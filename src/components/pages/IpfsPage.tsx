/* eslint-disable react/jsx-no-target-blank */
import {
  Tab, TabList, TabPanel, TabPanels, Tabs,
} from '@chakra-ui/core';
import { RouteComponentProps } from '@reach/router';
import IpfsFileManager from 'components/organisms/storage/IpfsFileManager';
import IpfsInfo from 'components/organisms/storage/IpfsInfo';
import OrbitDB from 'components/organisms/storage/OrbitDb';
import React, { useState } from 'react';
import IpfsPubSub from '../organisms/storage/IpfsPubSub';
import IpfsArweave from '../organisms/storage/IpfsArweave';
import Arweave from 'arweave';

const IpfsPage = (props: RouteComponentProps) => {
  const arweave = Arweave.init({});
  const [arweaveWallet, setArweaveWallet] = useState<any>({key: null, addr: '', balance: 0});

  const updateWallet = async (key: any) => {
    const addr = await arweave.wallets.jwkToAddress(key);
    const balance = await arweave.wallets.getBalance(addr);
    setArweaveWallet({key: key, addr: addr, balance: arweave.ar.winstonToAr(balance)});
  };

  return (<Tabs isFitted size="md" variant="enclosed-colored" variantColor="green">
    <TabList>
      <Tab>Files</Tab>
      <Tab>OrbitDb</Tab>
      <Tab>Pubsub</Tab>
      <Tab>Info</Tab>
      <Tab>Arweave</Tab>
    </TabList>
    <TabPanels>
      <TabPanel>
        <IpfsFileManager arweave={arweave} arweaveWallet={arweaveWallet}/>
      </TabPanel>
      <TabPanel>
        <OrbitDB />
      </TabPanel>
      <TabPanel>
        <IpfsPubSub />
      </TabPanel>
      <TabPanel>
        <IpfsInfo />
      </TabPanel>
      <TabPanel>
        <IpfsArweave arweave={arweave} arweaveWallet={arweaveWallet} updateWallet={updateWallet}/>
      </TabPanel>
    </TabPanels>
  </Tabs>);
}

export default IpfsPage;
