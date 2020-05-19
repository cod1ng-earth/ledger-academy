import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

import ADIToken from "./contracts/ADIToken.json";
import _secrets from "../.secrets.json";

const TransferForm = ({ updateBalance }: { updateBalance: Function }) => {
  const { account, library: web3 } = useWeb3React<Web3>();

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>();

  const transferADITokens = async (): Promise<void> => {
    const contract = new web3.eth.Contract(
      ADIToken.abi,
      _secrets.contractAddress
    );

    setIsTransactionPending(true);
    // https://web3js.readthedocs.io/en/v1.2.7/web3-eth-contract.html#id36
    const promiEvent = contract.methods.transfer(to, amount).send({
      from: account,
      gasPrice: 21 * 1e5,
    });
    promiEvent.on("transactionHash", setTransactionHash);
    promiEvent.on("receipt", (receipt) => {
      console.log(receipt);
      setIsTransactionPending(false);
      setTransactionHash("");
      updateBalance();
    });
    promiEvent.on("confirmation", (number, confirmation) => {
      console.debug(confirmation);
    });
  };

  return (
    <div>
      {isTransactionPending ? (
        <p>standby, your transaction {transactionHash} is pending</p>
      ) : (
        <>
          <label htmlFor="address">Adress</label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />

          <label htmlFor="amount">Amount</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button disabled={!to || !amount} onClick={transferADITokens}>
            Send!
          </button>
        </>
      )}
    </div>
  );
};

export default TransferForm;
