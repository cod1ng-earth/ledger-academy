import {
  Tab, TabList, TabPanel, TabPanels, Tabs,
} from '@chakra-ui/core';
import { RouteComponentProps } from '@reach/router';
import NaCLTools from 'components/organisms/identity/NaCLTools';
import ThreeBox from 'components/organisms/identity/ThreeBox';
import React from 'react';

const IdentityPage = (props: RouteComponentProps) => (
    <Tabs isFitted size="md" variant="enclosed-colored" variantColor="green">
      <TabList>
        <Tab>3box</Tab>
        <Tab>NaCL</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <ThreeBox />
        </TabPanel>
        <TabPanel>
          <NaCLTools />
        </TabPanel>
      </TabPanels>
    </Tabs>
);

export default IdentityPage;
