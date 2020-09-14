import React, { useEffect } from "react";
import { injected } from './connectors'
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { Link } from "@reach/router";

const Layout: React.FC = ({ children }) => {
  const context = useWeb3React<Web3>()
  const { activate } = context;

  useEffect(() => {
    activate(injected, console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <header>
        Demo [<Link to="/">main</Link> | <Link to="/ipfs">ipfs</Link>]
      </header>
      <main>{children}</main>
    </div>
  )
};

export default Layout;
