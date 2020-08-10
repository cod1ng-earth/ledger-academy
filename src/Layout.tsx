import React, { useEffect } from "react";
import { injected } from './connectors'
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

const Layout: React.FC = ({ children }) => {
  const context = useWeb3React<Web3>()
  const { activate } = context;

  useEffect(() => {
    activate(injected);
  }, []);

  return !context.active && !context.error ? (
    <div>loading...</div>
  ) : (
    <div>
      <header>Demo</header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
