import {
  Box, CSSReset, Flex, ThemeProvider,
} from '@chakra-ui/core';
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
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

const App: React.FC = () => (<ThemeProvider theme={customTheme}>
  <CSSReset />
  <Web3ReactProvider getLibrary={getLibrary}>
    <IPFSProvider>
      <Router>
        <Header />
        <Flex m={2}>
          <Box width="full">
            <main>
              <Switch>
                <Route exact path="/">
                  <EthPage />
                </Route>
                <Route path="/ipfs">
                  <IpfsPage />
                </Route>
                <Route path="/identity">
                  <IdentityPage />
                </Route>
                <Route path="/test">
                  <TestPage />
                </Route>
              </Switch>
            </main>
          </Box>
        </Flex>
      </Router>
    </IPFSProvider>
  </Web3ReactProvider>
</ThemeProvider>);
export default App;
