import { RouteComponentProps } from '@reach/router';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import ADIToken from '../../contracts/ADIToken.json';
import TransferForm from '../organisms/TransferForm';



const EthPage = (props: RouteComponentProps) => {
  const { account, library: web3, active: web3Active, error: web3Error } = useWeb3React<Web3>();

  const [ethBalance, setEthBalance] = useState<string>('');
  const [adiBalance, setADIBalance] = useState<string>('');

  // https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package/blob/master/contracts/presets/ERC20PresetMinterPauser.sol
  const queryADIBalance = async (): Promise<string> => {
    if (!web3) throw new Error('no web3');

    const contract = new web3.eth.Contract(
      ADIToken.abi as AbiItem[],
      process.env.REACT_APP_CONTRACT_ADDRESS,
    );
    let balance = "0";
    try {
      balance = await contract.methods
      .balanceOf(account)
      .call({ from: account });
    } catch(e) {
      console.error("ohoh - no eth provider found");
    }
    
    return balance;
  };

  useEffect(() => {
    (async () => {
      if (web3 && account) {
        const _ethBalance = await web3.eth.getBalance(account);
        const readableEthBalance = Web3.utils.fromWei(_ethBalance);
        setEthBalance(readableEthBalance);
        try {
          const _adiBalance = await queryADIBalance();
          const readableAdiBalance = Web3.utils.fromWei(_adiBalance);
          setADIBalance(readableAdiBalance);
        } catch(e) {
          setADIBalance("0");
        }
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, web3]);

  return (!web3Active) ? <p>enable web3 please {web3Error} </p> : (
    <div>
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
          {process.env.REACT_APP_CONTRACT_ADDRESS}
          )
        </small>
      </p>
      
      <p>to spare with others.</p>
      {adiBalance && (
        <TransferForm updateBalance={queryADIBalance} />
      )}
    </div>
  );
};

export default EthPage;
