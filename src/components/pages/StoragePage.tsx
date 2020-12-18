import {
  Tab, TabList, TabPanel, TabPanels, Tabs,
} from '@chakra-ui/core';
import Arweave from 'arweave';
import ArweaveTab, { ArweaveWallet } from 'components/organisms/storage/ArweaveTab';
import IpfsFileManager from 'components/organisms/storage/IpfsFileManager';
import IpfsInfo from 'components/organisms/storage/IpfsInfo';
import IpfsPubSub from 'components/organisms/storage/IpfsPubSub';
import OrbitDB from 'components/organisms/storage/OrbitDb';
import { useConfiguration } from 'components/organisms/storage/PinningConfiguration';
import usePinning from 'modules/pinning';
import React, { useEffect, useState } from 'react';

const StoragePage = () => {
  const [arweave, setArweave] = useState<any>();
  const [arweaveWallet, setArweaveWallet] = useState<ArweaveWallet>();

  const configuration = useConfiguration();

  const pinningApi = usePinning(configuration.pinningServiceConfiguration);

  useEffect(() => {
    setArweave(Arweave.init({
      host: 'arweave.net', // Hostname or IP address for a Arweave host
      port: 443, // Port
      protocol: 'https', // Network protocol http or https
      timeout: 20000, // Network request timeouts in milliseconds
      logging: false, // Enable network request logging
    }));
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
        <IpfsFileManager
          arweave={arweave}
          arweaveWallet={arweaveWallet}
          pinningApi={pinningApi}
        />
      </TabPanel>
      <TabPanel>
        <OrbitDB />
      </TabPanel>
      <TabPanel>
        <IpfsPubSub />
      </TabPanel>
      <TabPanel>
        <IpfsInfo
          config={configuration.pinningServiceConfiguration}
          updateConfig={configuration.updatePinningServiceConfiguration}
        />
      </TabPanel>
      <TabPanel>
        <ArweaveTab arweave={arweave} wallet={arweaveWallet} setWallet={setArweaveWallet}/>
      </TabPanel>
    </TabPanels>
  </Tabs>);
};

export default StoragePage;
