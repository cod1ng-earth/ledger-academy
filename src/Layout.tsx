import React, { useEffect } from "react";
import { useWeb3Context } from "web3-react";

const Layout: React.FC = ({ children }) => {
  const context = useWeb3Context();

  useEffect(() => {
    context.setConnector("MetaMask");
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
