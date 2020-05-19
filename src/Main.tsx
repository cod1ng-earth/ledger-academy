import React, { useState, useEffect } from "react";
import { useWeb3Context } from "web3-react";
import ADIToken from "./contracts/ADIToken.json";

const Main: React.FC = () => {
  const { account, library: web3 } = useWeb3Context();

  const [ethBalance, setEthBalance] = useState<string>("");

  useEffect(() => {
    (async () => {
      const ethBalance = await web3.eth.getBalance(account);
      setEthBalance(ethBalance);
    })();
  }, [web3]);

  return (
    <div>
      <p>oh hai {account}</p>
      <p>You've got {ethBalance}ETH</p>
      <p>to spare with others.</p>
    </div>
  );
};

export default Main;
