/* eslint-disable react/jsx-no-target-blank */
import {
  Tab, TabList, TabPanel, TabPanels, Tabs,
} from '@chakra-ui/core';
import Arweave from 'arweave';
import IpfsFileManager from 'components/organisms/storage/IpfsFileManager';
import IpfsInfo from 'components/organisms/storage/IpfsInfo';
import OrbitDB from 'components/organisms/storage/OrbitDb';
import React, { useState, useEffect } from 'react';
import ArweaveTab, { ArweaveWallet } from 'components/organisms/storage/ArweaveTab';
import IpfsPubSub from 'components/organisms/storage/IpfsPubSub';

const StoragePage = () => {
  const [arweave, setArweave] = useState<any>();
  const [arweaveWallet, setArweaveWallet] = useState<ArweaveWallet>();

  useEffect(() => {
    setArweave(Arweave.init({}));
  }, []);

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
        <ArweaveTab arweave={arweave} wallet={arweaveWallet} setWallet={setArweaveWallet}/>
      </TabPanel>
    </TabPanels>
  </Tabs>);
};

export default StoragePage;
