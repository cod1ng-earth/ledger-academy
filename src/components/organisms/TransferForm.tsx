import { Button, Flex } from '@chakra-ui/core';
import { useWeb3React } from '@web3-react/core';
import React, { useState } from 'react';
import Web3 from 'web3';
import RecipientForm, { IRecipient } from '../molecules/RecipientForm';

const TransferForm = ({ onFinished, contract }: { onFinished: Function, contract: any }) => {
  const { account } = useWeb3React<Web3>();

  const [recipients, setRecipients] = useState<IRecipient[]>([]);

  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>();

  const transferADITokens = async (): Promise<void> => {
    console.log(recipients);
    setIsTransactionPending(true);
    // https://web3js.readthedocs.io/en/v1.2.7/web3-eth-contract.html#id36
    const promiEvent = contract.methods.transfer('0x', 10).send({
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

  const addRecipient = (): IRecipient => {
    const r: IRecipient = {
      address: '0x',
      amount: (0).toString(),
    };
    setRecipients([...recipients, r]);
    return r;
  };

  const changeRecipient = (address: string, r: IRecipient) => {
    console.log(recipients);
    console.log(r);
    const _recipients = [
      ...recipients.filter((_r) => address !== _r.address),
      r,
    ];
    setRecipients(_recipients);
  };

  return (
      <Flex direction="column" align="center" justifyContent="stretch" wrap="wrap">

        {recipients.map((r) => <RecipientForm
          key={r.address}
          recipient={r}
          disabled={isTransactionPending}
          onChange={changeRecipient}
        />)}
        <Flex direction="row">
          <Button onClick={addRecipient}>add</Button>

          <Button variantColor="red"
            isLoading={isTransactionPending}
            loadingText="transacting"
            isDisabled={ isTransactionPending || recipients.length === 0}
            onClick={transferADITokens}>
            Send to {recipients.length} recipients
          </Button>
        </Flex>
        {transactionHash}
      </Flex>
  );
};

export default TransferForm;
