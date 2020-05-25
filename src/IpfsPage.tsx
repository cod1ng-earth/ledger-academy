import React, { useState, useEffect } from "react";
import { useWeb3Context } from "web3-react";
import ADIToken from "./contracts/ADIToken.json";
import TransferForm from "./TransferForm";
import _secrets from "../.secrets.json";

import Web3 from "web3";

const IpfsPage: React.FC = () => {
  const { account, library: web3 } = useWeb3Context();

  useEffect(() => {
    (async () => {})();
  }, [web3]);

  return (
    <div>
      <p>
        oh hai <b>{account}</b>
      </p>
    </div>
  );
};

export default IpfsPage;
