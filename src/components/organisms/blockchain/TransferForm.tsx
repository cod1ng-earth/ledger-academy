import { Button, Flex, Heading } from '@chakra-ui/core';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import RecipientForm, { IRecipient } from '../../molecules/blockchain/RecipientForm';

const TransferForm = ({ onFinished, contract }: { onFinished: Function, contract: any }) => {
  const { account } = useWeb3React<Web3>();

  const [recipients, setRecipients] = useState<IRecipient[]>([]);
  const [validRecipients, setValidRecipients] = useState<IRecipient[]>([]);

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
      amount: 0.01,
    };
    setRecipients([...recipients, r]);
    return r;
  };

  const changeRecipient = (oldAddress: string, r: IRecipient) => {
    if (r.address.length === 0) {
      setRecipients(
        recipients.filter((_r) => oldAddress !== _r.address),
      );
    } else {
      setRecipients([
        ...recipients.filter((_r) => oldAddress !== _r.address && _r.address !== r.address),
        r,
      ]);
    }
  };

  useEffect(() => {
    setValidRecipients(recipients.filter(
      (r: IRecipient) => Web3.utils.isAddress(r.address) && r.amount > 0,
    ));
  }, [recipients]);

  return (
    <Flex direction="column" my="6" w="100%">
      <Heading size="md">Transfer to</Heading>
      <Flex direction="column" w="100%">
        {recipients.map((r) => <RecipientForm
          key={`${r.address}`}
          recipient={r}
          disabled={isTransactionPending}
          onChange={(recipient: IRecipient) => changeRecipient(r.address, recipient)}
        />)}
      </Flex>
      <Flex direction="row" align="center" justify="center">
        <Button onClick={addRecipient}>add recipient</Button>
        {validRecipients.length > 0
          && <Button variantColor="red"
            isLoading={isTransactionPending}
            loadingText="transacting"
            isDisabled={isTransactionPending || recipients.length === 0}
            onClick={airdropADITokens}>
            Send to {validRecipients.length} recipients
          </Button>
        }
      </Flex>
      {transactionHash}
    </Flex>
  );
};

export default TransferForm;
