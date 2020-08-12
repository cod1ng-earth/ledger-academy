import React from "react";
import Layout from "./Layout";
import { Web3ReactProvider } from '@web3-react/core'

import Main from "./Main";
import Web3 from "web3";

const getLibrary = (provider: any): Web3 => {
  return new Web3(provider)
};
  
const App: React.FC = () => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <Layout>
      <Main></Main>
    </Layout>
  </Web3ReactProvider>
);

export default App;
