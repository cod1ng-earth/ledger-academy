import {
  Tab, TabList, TabPanel, TabPanels, Tabs,
} from '@chakra-ui/core';
import IpfsFileManager from 'components/organisms/storage/IpfsFileManager';
import IpfsInfo from 'components/organisms/storage/IpfsInfo';
import OrbitDB from 'components/organisms/storage/OrbitDb';
import ArweaveTab from 'components/organisms/storage/ArweaveTab';
import IpfsPubSub from 'components/organisms/storage/IpfsPubSub';
import { ArweaveProvider } from 'context/Arweave';
import usePinningService from 'modules/pinning';
import PinningConfigurationDialog from 'components/organisms/storage/PinningConfiguration';
import React from 'react';

const StoragePage = () => {

  const {
     pin, checkPin, pinningServiceConfiguration, updatePinningServiceConfiguration
  } = usePinningService();

  return (<Tabs isFitted size="md" variant="enclosed-colored" variantColor="green">
    <ArweaveProvider>
      <TabList>
        <Tab>Files</Tab>
        <Tab>OrbitDb</Tab>
        <Tab>Pubsub</Tab>
        <Tab>Info</Tab>
        <Tab>Arweave</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <IpfsFileManager pinningApi={{pin, checkPin}} />
        </TabPanel>
        <TabPanel>
          <OrbitDB />
        </TabPanel>
        <TabPanel>
          <IpfsPubSub />
        </TabPanel>
        <TabPanel>
          <IpfsInfo/>
          <PinningConfigurationDialog config={pinningServiceConfiguration} updateConfig={updatePinningServiceConfiguration}  />
        </TabPanel>
        <TabPanel>
          <ArweaveTab />
        </TabPanel>
      </TabPanels>
    </ArweaveProvider>
  </Tabs>);
};

export default StoragePage;
