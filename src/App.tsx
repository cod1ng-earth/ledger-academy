import {
  Box, CSSReset, Flex, ThemeProvider,
} from '@chakra-ui/core';
import { Web3ReactProvider } from '@web3-react/core';
import Footer from 'components/molecules/Footer';
import Header from 'components/molecules/Header';

import React from 'react';
import {
  HashRouter as Router,
  Route, Switch,
} from 'react-router-dom';
import Web3 from 'web3';
import EthPage from './components/pages/EthPage';
import IdentityPage from './components/pages/IdentityPage';
import StoragePage from './components/pages/StoragePage';
import { IPFSProvider } from './context/IPFS';
import customTheme from './theme';

const getLibrary = (provider: any): Web3 => new Web3(provider);

const App: React.FC = () => {
  return (
    <ThemeProvider theme={customTheme}>
      <CSSReset />
        <Web3ReactProvider getLibrary={getLibrary}>
          <IPFSProvider>
            <Router>
              <Flex direction="column" minHeight="100vh">
                <Header />
                <Flex m={2} flexGrow={1}>
                  <Box width="full">
                    <Switch>
                      <Route exact path="/">
                        <EthPage />
                      </Route>
                      <Route path="/storage">
                        <StoragePage />
                      </Route>
                      <Route path="/identity">
                        <IdentityPage />
                      </Route>
                    </Switch>
                  </Box>
                </Flex>
                <Footer />
              </Flex>
            </Router>
          </IPFSProvider>
        </Web3ReactProvider>
    </ThemeProvider>
  )
}

export default App;
