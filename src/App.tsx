import { Router } from "@reach/router";
import { Web3ReactProvider } from '@web3-react/core';
import React from "react";
import Web3 from "web3";
import { IPFSProvider } from "./context/IPFS";
import IpfsPage from "./IpfsPage";
import IdentityPage from "./IdentityPage";
import Layout from "./Layout";
import Main from "./Main";



const getLibrary = (provider: any): Web3 => {
  return new Web3(provider)
};
  
const App: React.FC = () => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <IPFSProvider>
      <Layout>
        <Router>
          <Main path="/" />
          <IpfsPage path="ipfs" />
          <IdentityPage path="identity" />
        </Router>
      </Layout>
    </IPFSProvider>
  </Web3ReactProvider>
);

export default App;
