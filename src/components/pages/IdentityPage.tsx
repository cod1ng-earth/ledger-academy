import {
  Tab, TabList, TabPanel, TabPanels, Tabs,
} from '@chakra-ui/core';
import NaCLTools from 'components/organisms/identity/NaCLTools';
import React from 'react';

const IdentityPage = () => (
    <Tabs isFitted size="md" variant="enclosed-colored" variantColor="green">
      <TabList>
        <Tab>NaCL</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <NaCLTools />
        </TabPanel>
      </TabPanels>
    </Tabs>
);

export default IdentityPage;
