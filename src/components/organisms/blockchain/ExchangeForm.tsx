import { useWeb3React } from '@web3-react/core';
import OneLineTextInput, { InputBase } from 'components/atoms/InputFlex';
import React, { useState } from 'react';
import Web3 from 'web3';

const ExchangeForm = ({ contract, onFinished }: {
  contract: any,
  onFinished: Function,
}) => {
  const { account } = useWeb3React<Web3>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const exchangeEthForADI = async (amount: string): Promise<void> => {
    const wei = Web3.utils.numberToHex(Web3.utils.toWei(amount));
    setIsLoading(true);
    // https://web3js.readthedocs.io/en/v1.2.7/web3-eth-contract.html#id36
    const promiEvent = contract.methods.exchange().send({
      value: wei,
      from: account,
    });
    promiEvent.on('receipt', (receipt: any) => {
      setIsLoading(false);
      onFinished();
    });
  };

  return (
    <InputBase>
      <OneLineTextInput
        label="amount"
        initialValue="0.01"
        placeholder="enter an eth amount to exchange (e.g. 0.01)"
        submitLabel="exchange"
        onSubmit={(amount: string) => exchangeEthForADI(amount)}
        isDisabled={isLoading}
      />
    </InputBase>
  );
};

export default ExchangeForm;
