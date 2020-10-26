import {
  Alert, AlertDescription, AlertTitle, Badge, Box, Flex, Text, Link,
} from '@chakra-ui/core';
import { RouteComponentProps } from '@reach/router';
import { useWeb3React } from '@web3-react/core';
import Web3Alert from 'components/atoms/Web3Alert';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import MintForm from 'components/organisms/MintForm';
import ADIToken from '../../contracts/ADIToken.json';
import TransferForm from '../organisms/TransferForm';

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

  const networkExplorerUrl = `https://${networkType === 'main' ? '' : networkType}.etherscan.io`;

  return (!web3Active) ? <Web3Alert /> : (
    <Box>
      <Alert status="success" flexDirection="row" justifyContent="space-between">
        <Flex flexDirection="row" alignItems="center">
          <AlertTitle mr={2}>You're connected!</AlertTitle>
          <AlertDescription>{account}</AlertDescription>
        </Flex>

        <Badge>{networkType}</Badge>

      </Alert>

      <Flex mt={2} wrap="wrap" >
        <Flex p={2} width={['100%', 1 / 2]} bg="blue.300" color="white" align="center" justify="center">
          <Text fontSize="3xl" fontWeight="bold">{ethBalance} Ξ</Text>
        </Flex>
        <Flex p={2} width={['100%', 1 / 2]} bg="pink.300" color="white" align="center" direction="column">

          <Text fontSize="3xl" fontWeight="bold">{adiBalance} Å</Text>
          {contract && <Link href={`${networkExplorerUrl}/address/${contract.options.address}`} isExternal fontSize="xs">{contract.options.address}</Link>}

        </Flex>
      </Flex>

      {adiBalance && (
        <TransferForm onFinished={queryContractState} contract={contract} />
      )}

      {isMinter && (
        <MintForm onFinished={queryContractState} contract={contract} />
      )}
    </Box>
  );
};

export default EthPage;
