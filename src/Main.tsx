import React from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

const Main: React.FC = () => {
  const context = useWeb3React<Web3>()
  const { account } = context;

  return (
    <div>
      <p>oh hai {account}</p>
    </div>
  );
};

export default Main;
