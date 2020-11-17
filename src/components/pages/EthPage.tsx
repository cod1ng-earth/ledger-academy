import { Box, SimpleGrid, Heading } from '@chakra-ui/core';
import { RouteComponentProps } from '@reach/router';
import { useWeb3React } from '@web3-react/core';
import Web3Alert, { ConnectedAlert } from 'components/atoms/Web3Alert';
import MintForm from 'components/organisms/blockchain/MintForm';
import React, { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { EthBalance, AdiBalance } from 'components/atoms/Balances';
import ExchangeForm from 'components/organisms/blockchain/ExchangeForm';
import ADIToken from '../../contracts/ADIToken.json';
import TransferForm from '../organisms/blockchain/TransferForm';

const EthPage = (props: RouteComponentProps) => {
  const MINTER_ROLE = Web3.utils.keccak256('MINTER_ROLE');

  const {
    account, library: web3, active: web3Active,
  } = useWeb3React<Web3>();

  const [contract, setContract] = useState<any>();
  const [ethBalance, setEthBalance] = useState<number>(0.0);
  const [adiBalance, setADIBalance] = useState<string>('');
  const [networkType, setNetworkType] = useState<string>('');
  const [isMinter, setIsMinter] = useState<string>('');

  // https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package/blob/master/contracts/presets/ERC20PresetMinterPauser.sol
  const queryContractState = useCallback(async (): Promise<string> => {
    let balance = '0';
    try {
      balance = await contract.methods
        .balanceOf(account)
        .call({ from: account });
      const readableAdiBalance = Web3.utils.fromWei(balance);
      setADIBalance(readableAdiBalance);
      return readableAdiBalance;
    } catch (e) {
      console.error('ohoh - no eth provider found');
    }
    return balance;
  }, [account, contract]);

  const queryMinterRole = useCallback(async (): Promise<void> => {
    if (account && contract) {
      setIsMinter(await contract.methods.hasRole(MINTER_ROLE, account).call());
    }
  }, [MINTER_ROLE, account, contract]);

  useEffect(() => {
    (async () => {
      if (web3 && account) {
        setNetworkType(await web3.eth.net.getNetworkType());

        const _ethBalance = await web3.eth.getBalance(account);
        const readableEthBalance = Web3.utils.fromWei(_ethBalance);
        const floatEthBalance = parseFloat(readableEthBalance);
        setEthBalance(floatEthBalance);

        const _contract = new web3.eth.Contract(
          ADIToken.abi as AbiItem[],
          process.env.REACT_APP_CONTRACT_ADDRESS,
        );
        setContract(_contract);
      }
    })();
  }, [account, web3]);

  useEffect(() => {
    if (!contract) return;
    queryContractState();
    queryMinterRole();
  }, [contract, queryContractState, queryMinterRole]);

  return (!web3Active) ? <Web3Alert /> : (
    <Box>
      {account && <ConnectedAlert account={account} networkType={networkType} />}

      <SimpleGrid minChildWidth="400px" spacing="2" mt="2">
        <EthBalance balance={ethBalance} />
        {contract && <AdiBalance balance={adiBalance} network={networkType} contract={contract} />}
      </SimpleGrid>

      { (contract && (ethBalance > 0)) && (
        <>
          <Heading size="md" mt={2}>exchange Eth for ADI</Heading>
          <ExchangeForm contract={contract} onFinished={queryContractState} />
        </>
      )}

      {Number.parseFloat(adiBalance) > 0 && (
        <TransferForm onFinished={queryContractState} contract={contract} />
      )}

      {isMinter && (
        <MintForm onFinished={queryContractState} contract={contract} />
      )}
    </Box>
  );
};

export default EthPage;
