import { Box, SimpleGrid } from '@chakra-ui/core';
import { RouteComponentProps } from '@reach/router';
import { useWeb3React } from '@web3-react/core';
import Web3Alert, { ConnectedAlert } from 'components/atoms/Web3Alert';
import MintForm from 'components/organisms/blockchain/MintForm';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { EthBalance, AdiBalance } from 'components/atoms/Balances';
import ADIToken from '../../contracts/ADIToken.json';
import TransferForm from '../organisms/blockchain/TransferForm';

const EthPage = (props: RouteComponentProps) => {
  const MINTER_ROLE = Web3.utils.keccak256('MINTER_ROLE');

  const {
    account, library: web3, active: web3Active,
  } = useWeb3React<Web3>();

  const [contract, setContract] = useState<any>();
  const [ethBalance, setEthBalance] = useState<string>('');
  const [adiBalance, setADIBalance] = useState<string>('');
  const [networkType, setNetworkType] = useState<string>('');
  const [isMinter, setIsMinter] = useState<string>('');

  // https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package/blob/master/contracts/presets/ERC20PresetMinterPauser.sol
  const queryContractState = async (): Promise<string> => {
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
  };

  const queryMinterRole = async (): Promise<void> => {
    setIsMinter(await contract.methods.hasRole(MINTER_ROLE, account).call());
  };

  useEffect(() => {
    (async () => {
      if (web3 && account) {
        const _ethBalance = await web3.eth.getBalance(account);
        const readableEthBalance = Web3.utils.fromWei(_ethBalance);
        setNetworkType(await web3.eth.net.getNetworkType());
        setEthBalance(readableEthBalance);
        const _contract = new web3.eth.Contract(
          ADIToken.abi as AbiItem[],
          process.env.REACT_APP_CONTRACT_ADDRESS,
        );
        setContract(_contract);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, web3]);

  useEffect(() => {
    if (!contract) return;
    queryContractState();
    queryMinterRole();
  }, [contract]);

  return (!web3Active) ? <Web3Alert /> : (
    <Box>
      {account && <ConnectedAlert account={account} networkType={networkType} />}

      <SimpleGrid minChildWidth="400px" spacing="2" mt="2">
        <EthBalance balance={ethBalance} />
        {contract && <AdiBalance balance={adiBalance} network={networkType} contract={contract} />}
      </SimpleGrid>

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
