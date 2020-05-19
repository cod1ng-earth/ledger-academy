import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

import ADIToken from "./contracts/ADIToken.json";
import _secrets from "../.secrets.json";

//https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package/blob/master/contracts/presets/ERC20PresetMinterPauser.sol
const queryADIBalance = async (
  web3: Web3,
  address: string
): Promise<string> => {
  const contract = new web3.eth.Contract(
    ADIToken.abi,
    _secrets.contractAddress
  );

  const balance = await contract.methods
    .balanceOf(address)
    .call({ from: address });
  return balance;
};

const Main: React.FC = () => {
  const { account, library: web3 } = useWeb3React<Web3>();

  const [ethBalance, setEthBalance] = useState<string>("");
  const [adiBalance, setADIBalance] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const _ethBalance = await web3.eth.getBalance(account);
      const readableEthBalance = Web3.utils.fromWei(_ethBalance);
      setEthBalance(readableEthBalance);

      const _adiBalance = await queryADIBalance(web3, account);
      const readableAdiBalance =
        parseFloat(Web3.utils.fromWei(_adiBalance)) * 1e18;
      setADIBalance(readableAdiBalance);
    })();
  }, [web3]);

  return (
    <div>
      <p>
        oh hai <b>{account}</b>
      </p>
      <p>
        You've got <b>{ethBalance}ETH</b>
      </p>
      <p>You've got {adiBalance}AĐI</p>
      <p>to spare with others.</p>
    </div>
  );
};

export default Main;
