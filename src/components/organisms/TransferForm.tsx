import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

import {
  FormControl, FormLabel, Input, FormHelperText, Button, Flex,
} from '@chakra-ui/core';
import ADIToken from '../../contracts/ADIToken.json';

const TransferForm = ({ updateBalance }: { updateBalance: Function }) => {
  const { account, library: web3 } = useWeb3React<Web3>();

  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>();

  const transferADITokens = async (): Promise<void> => {
    const contract = new web3!.eth.Contract(
      ADIToken.abi as AbiItem[],
      process.env.REACT_APP_CONTRACT_ADDRESS,
    );

    setIsTransactionPending(true);
    // https://web3js.readthedocs.io/en/v1.2.7/web3-eth-contract.html#id36
    const promiEvent = contract.methods.transfer(to, amount).send({
      from: account,
      gasPrice: 21 * 1e5,
    });
    promiEvent.on('transactionHash', setTransactionHash);
    promiEvent.on('receipt', (receipt: any) => {
      console.log(receipt);
      setIsTransactionPending(false);
      setTransactionHash('');
      updateBalance();
    });
    promiEvent.on('confirmation', (number: number, confirmation: any) => {
      console.debug(confirmation);
    });
  };

  return (
      <Flex direction="row" align="center" justifyContent="center" wrap="wrap">
        <FormControl isDisabled={isTransactionPending}>
          <FormLabel htmlFor="address" >Adress</FormLabel>
          <Input
            type="text" value={to}
            onChange={(e: any) => setTo(e.target.value)}
          />
          <FormHelperText>
            The recipient&apos;s Ethereum address
          </FormHelperText>
        </FormControl>

        <FormControl isDisabled={isTransactionPending}>
          <FormLabel htmlFor="amount">Amount</FormLabel>
          <Input
            type="number" value={amount}
            onChange={(e: any) => setAmount(e.target.value)}
          />
          <FormHelperText>
            The amount to transfer
          </FormHelperText>
        </FormControl>

        <Button variantColor="red"
          isLoading={isTransactionPending}
          loadingText="transacting"
          isDisabled={!to || !amount || isTransactionPending}
          onClick={transferADITokens}>
          Send!
        </Button>
        {transactionHash}
      </Flex>
  );
};

export default TransferForm;
