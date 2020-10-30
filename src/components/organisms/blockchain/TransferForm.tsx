import { Button, Flex, Heading } from '@chakra-ui/core';
import { useWeb3React } from '@web3-react/core';
import React, { useState } from 'react';
import Web3 from 'web3';
import RecipientForm, { IRecipient } from '../../molecules/blockchain/RecipientForm';

const TransferForm = ({ onFinished, contract }: { onFinished: Function, contract: any }) => {
  const { account } = useWeb3React<Web3>();

  const [recipients, setRecipients] = useState<IRecipient[]>([]);

  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>();

  const airdropADITokens = async (): Promise<void> => {
    setIsTransactionPending(true);

    const recips = [];
    const amts = [];
    for (const rec of recipients) {
      recips.push(rec.address);
      amts.push(Web3.utils.toBN(rec.amount));
    }

    const methodCall = contract.methods.airdrop(recips, amts);
    const gasEstimate = await methodCall.estimateGas({
      from: account,
    });

    const promiEvent = methodCall.send({
      from: account,
      gasPrice: gasEstimate,
    });

    promiEvent.on('transactionHash', setTransactionHash);
    promiEvent.on('receipt', (receipt: any) => {
      console.log(receipt);
      setIsTransactionPending(false);
      setTransactionHash('');
      setRecipients([]);
      onFinished();
    });
    promiEvent.on('error', (err: any, receipt: any) => {
      setIsTransactionPending(false);
      console.error(err, receipt);
    });

    promiEvent.on('confirmation', (number: number, confirmation: any) => {
      console.debug(confirmation);
    });
  };

  const addRecipient = (): IRecipient => {
    const r: IRecipient = {
      address: '0x',
      amount: 1e12.toString(),
    };
    setRecipients([...recipients, r]);
    return r;
  };

  const changeRecipient = (address: string, r: IRecipient) => {
    const _recipients = [
      ...recipients.filter((_r) => address !== _r.address),
      r,
    ];
    console.log(_recipients);
    setRecipients(_recipients);
  };

  return (
      <Flex direction="column" align="flex-start" my="6">
        <Heading size="md">Transfer to</Heading>
        {recipients.map((r) => <RecipientForm
          key={r.address}
          recipient={r}
          disabled={isTransactionPending}
          onChange={changeRecipient}
        />)}
        <Flex direction="row">
          <Button onClick={addRecipient}>add recipient</Button>
          {recipients.length > 0
          && <Button variantColor="red"
            isLoading={isTransactionPending}
            loadingText="transacting"
            isDisabled={ isTransactionPending || recipients.length === 0}
            onClick={airdropADITokens}>
            Send to {recipients.length} recipients
          </Button>
          }
        </Flex>
        {transactionHash}
      </Flex>
  );
};

export default TransferForm;
