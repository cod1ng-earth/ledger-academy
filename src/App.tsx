import React from "react";
import { Router, Link } from "@reach/router";
import Layout from "./Layout";
import { Connectors } from "web3-react";
import Web3Provider from "web3-react";
import Main from "./Main";
import IpfsPage from "./IpfsPage";
import Web3 from "web3";

const { InjectedConnector } = Connectors;
const MetaMask = new InjectedConnector({
  supportedNetworks: [1, 3, 4, 5, 7, 17],
});
const connectors = { MetaMask: MetaMask };

const App: React.FC = () => (
  <Web3Provider connectors={connectors} libraryName="web3.js" web3Api={Web3}>
    <Layout>
      <Router>
        <Main path="/" />
        <IpfsPage path="ipfs" />
      </Router>
    </Layout>
  </Web3Provider>
);

export default App;
