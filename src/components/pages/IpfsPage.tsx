/* eslint-disable react/jsx-no-target-blank */
import {
  Tab, TabList, TabPanel, TabPanels, Tabs,
} from '@chakra-ui/core';
import { RouteComponentProps } from '@reach/router';
import IpfsFileManager from 'components/organisms/IpfsFileManager';
import React, { useState } from 'react';
import IpfsPubSub from '../organisms/IpfsPubSub';

const IpfsPage = (props: RouteComponentProps) => {
  const [pubsubTopic, setPubsubTopic] = useState<string>('');

  return <Tabs isFitted size="md" variant="enclosed" defaultIndex={1}>
      <TabList>
        <Tab>Files</Tab>
        <Tab>Pubsub</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <IpfsFileManager />
        </TabPanel>
        <TabPanel>
          <IpfsPubSub onTopic={setPubsubTopic}/>
        </TabPanel>
      </TabPanels>
    </Tabs>;
};

export default IpfsPage;
