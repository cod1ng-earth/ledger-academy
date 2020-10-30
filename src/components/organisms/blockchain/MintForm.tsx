import { Button, Flex, Heading } from '@chakra-ui/core';
import { useWeb3React } from '@web3-react/core';
import RecipientForm, { IRecipient } from 'components/molecules/blockchain/RecipientForm';
import React, { useState } from 'react';
import Web3 from 'web3';

const MintForm = ({ onFinished, contract }: { onFinished: Function, contract: any }) => {
  const { account } = useWeb3React<Web3>();

  const [recipient, setRecipient] = useState<IRecipient>({
    address: '0x',
    amount: 1e18.toString(),
  });

  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>();

  const isValid = (_recipient: IRecipient): boolean => Web3.utils.isAddress(_recipient.address);

  const mintADITokens = async (_recipient: IRecipient): Promise<void> => {
    console.log(_recipient);

    setIsTransactionPending(true);
    // https://web3js.readthedocs.io/en/v1.2.7/web3-eth-contract.html#id36
    const promiEvent = contract.methods.mint(recipient.address, recipient.amount).send({
      from: account,
      gasPrice: 21 * 1e5,
    });
    promiEvent.on('transactionHash', setTransactionHash);
    promiEvent.on('receipt', (receipt: any) => {
      console.log(receipt);
      setIsTransactionPending(false);
      setTransactionHash('');
      onFinished();
    });
    promiEvent.on('confirmation', (number: number, confirmation: any) => {
      console.debug(confirmation);
    });
  };

  return (
      <Flex direction="column" justifyContent="stretch" my="6">
        <Heading size="md">Mint to</Heading>
        <RecipientForm
          recipient={recipient}
          disabled={isTransactionPending}
          onChange={(addr, recip) => setRecipient(recip)}
        />

        <Flex direction="row">
          <Button variantColor="red"
            isLoading={isTransactionPending}
            loadingText="transacting"
            isDisabled={ isTransactionPending || !isValid(recipient) }
            onClick={() => mintADITokens(recipient)}>
           Mint
          </Button>
        </Flex>
        {transactionHash}
      </Flex>
  );
};

export default MintForm;
