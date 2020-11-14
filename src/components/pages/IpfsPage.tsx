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

const IpfsPage = (props: RouteComponentProps) => {
  const [pubsubTopic, setPubsubTopic] = useState<string>('');

  return <Tabs isFitted size="md" variant="enclosed-colored" variantColor="green">
    <TabList>
      <Tab>Files</Tab>
      <Tab>OrbitDb</Tab>
      <Tab>Pubsub</Tab>
      <Tab>Info</Tab>
    </TabList>
    <TabPanels>
      <TabPanel>
        <IpfsFileManager />
      </TabPanel>
      <TabPanel>
        <OrbitDB />
      </TabPanel>
      <TabPanel>
        <IpfsPubSub onTopic={setPubsubTopic} />
      </TabPanel>
      <TabPanel>
        <IpfsInfo />
      </TabPanel>
    </TabPanels>
  </Tabs>;
};

export default IpfsPage;
