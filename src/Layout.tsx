import React, { useEffect } from "react";
import { useWeb3Context } from "web3-react";
import { Link } from "@reach/router";

const Layout: React.FC = ({ children }) => {
  const context = useWeb3Context();

  useEffect(() => {
    context.setConnector("MetaMask");
  }, []);

  return !context.active && !context.error ? (
    <div>loading...</div>
  ) : (
    <div>
      <header>
        Demo [<Link to="/">main</Link> | <Link to="/ipfs">ipfs</Link>]
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
