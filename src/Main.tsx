import React, { useState, useEffect } from "react";
import { useWeb3Context } from "web3-react";
import ADIToken from "./contracts/ADIToken.json";
import TransferForm from "./TransferForm";
import _secrets from "../.secrets.json";

import Web3 from "web3";

const Main: React.FC = () => {
  const { account, library: web3 } = useWeb3Context();

  const [ethBalance, setEthBalance] = useState<string>("");
  const [adiBalance, setADIBalance] = useState<string>("");

  //https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package/blob/master/contracts/presets/ERC20PresetMinterPauser.sol
  const queryADIBalance = async (): Promise<string> => {
    const contract = new web3.eth.Contract(
      ADIToken.abi,
      _secrets.contractAddress
    );

    const balance = await contract.methods
      .balanceOf(account)
      .call({ from: account });
    return balance;
  };

  useEffect(() => {
    (async () => {
      const _ethBalance = await web3.eth.getBalance(account);
      const readableEthBalance = Web3.utils.fromWei(_ethBalance);
      setEthBalance(readableEthBalance);

      const _adiBalance = await queryADIBalance();
      const readableAdiBalance = Web3.utils.fromWei(_adiBalance);
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
      <p>
        You've got {adiBalance}AĐI <br />
        <small>({_secrets.contractAddress})</small>
      </p>
      <p>to spare with others.</p>
      {adiBalance && (
        <TransferForm updateBalance={queryADIBalance}></TransferForm>
      )}
    </div>
  );
};

export default Main;
