import {
  Box, CSSReset, Flex, ThemeProvider,
} from '@chakra-ui/core';
import {
  createHistory, HistorySource, LocationProvider, Router,
} from '@reach/router';
import { Web3ReactProvider } from '@web3-react/core';
import Header from 'components/molecules/Header';
import TestPage from 'components/pages/TestPage';
import React from 'react';
import Web3 from 'web3';
import EthPage from './components/pages/EthPage';
import IdentityPage from './components/pages/IdentityPage';
import IpfsPage from './components/pages/IpfsPage';
import { IPFSProvider } from './context/IPFS';
import customTheme from './theme';

const getLibrary = (provider: any): Web3 => new Web3(provider);

const App: React.FC = () => {
  const history = createHistory(window as unknown as HistorySource);
  return (<ThemeProvider theme={customTheme}>
    <CSSReset />
    <LocationProvider history={history}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <IPFSProvider>
          <Header />
          <Flex m={2}>
            <Box width="full">

              <main>
                <Router>
                  <EthPage path="/" />
                  <IpfsPage path="ipfs" />
                  <IdentityPage path="identity" />
                  <TestPage path="test" />
                </Router>
              </main>
            </Box>
          </Flex>
        </IPFSProvider>
      </Web3ReactProvider>
    </LocationProvider>
  </ThemeProvider>);
};

export default App;
