import { Box, CSSReset, Flex, ThemeProvider } from "@chakra-ui/core";
import { Router, LocationProvider, createHistory, HistorySource } from "@reach/router";
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import Header from "components/molecules/Header";
import React, { useEffect } from "react";
import Web3 from "web3";
import EthPage from "./components/pages/EthPage";
import IdentityPage from "./components/pages/IdentityPage";
import IpfsPage from "./components/pages/IpfsPage";
import { IPFSProvider } from "./context/IPFS";
import customTheme from './theme';
import { injected } from "modules/connectors";

const ActivateWeb3: React.FC<any> = ({children}) => {
  const context = useWeb3React<Web3>()
  const { activate } = context;

  useEffect(() => {
    activate(injected, console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>
}

const getLibrary = (provider: any): Web3 => {
  return new Web3(provider)
};
  
const App: React.FC = () => {
  const history = createHistory(window as unknown as HistorySource)
  return (<ThemeProvider theme={customTheme}>
    <CSSReset />
    <LocationProvider history={history}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <ActivateWeb3>
        <IPFSProvider>
        <Header />
          <Flex m={2}>
            <Box width="full">
            
            <main>
              <Router>
                <EthPage path="/" />
                <IpfsPage path="ipfs" />
                <IdentityPage path="identity" />
              </Router>
            </main>
            </Box>
          </Flex>
        </IPFSProvider>
      </ActivateWeb3>
    </Web3ReactProvider>
    </LocationProvider>
  </ThemeProvider>)
};

export default App;
