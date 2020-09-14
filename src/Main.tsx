/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import ADIToken from './contracts/ADIToken.json';
import TransferForm from './TransferForm';

const Main: React.FC = () => {
  const { account, library: web3, active: web3Active, error: web3Error } = useWeb3React<Web3>();

  const [ethBalance, setEthBalance] = useState<string>('');
  const [adiBalance, setADIBalance] = useState<string>('');

  // https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package/blob/master/contracts/presets/ERC20PresetMinterPauser.sol
  const queryADIBalance = async (): Promise<string> => {
    if (!web3) throw new Error('no web3');

    const contract = new web3.eth.Contract(
      ADIToken.abi as AbiItem[],
      process.env.CONTRACT_ADDRESS,
    );

    const balance = await contract.methods
      .balanceOf(account)
      .call({ from: account });
    return balance;
  };

  useEffect(() => {
    (async () => {
      if (web3) {
        const _ethBalance = await web3.eth.getBalance(account);
        const readableEthBalance = Web3.utils.fromWei(_ethBalance);
        setEthBalance(readableEthBalance);

        const _adiBalance = await queryADIBalance();
        const readableAdiBalance = Web3.utils.fromWei(_adiBalance);
        setADIBalance(readableAdiBalance);
      }
    })();
  }, [web3]);

  return (
    {web3Active && !web3Error && <div>
      <p>
        oh hai
        {' '}
        <b>{account}</b>
      </p>
      <p>
        You've got
        {' '}
        <b>
          {ethBalance}
          ETH
        </b>
      </p>
      <p>
        You've got
        {' '}
        {adiBalance}
        AĐI
        {' '}
        <br />
        <small>
          (
          {process.env.CONTRACT_ADDRESS}
          )
        </small>
      </p>
      <p>to spare with others.</p>
      {adiBalance && (
        <TransferForm updateBalance={queryADIBalance} />
      )}
    </div>
      }
  );
};

export default Main;
