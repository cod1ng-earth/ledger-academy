import {
  FormControl, FormHelperText, FormLabel, Input,
} from '@chakra-ui/core';
import { InputBase } from 'components/atoms/InputFlex';
import React, { useState } from 'react';

export interface IRecipient {
  address: string,
  amount: number,
}

const RecipientForm = ({ disabled, recipient, onChange }: {
  disabled: boolean,
  recipient: IRecipient,
  onChange: (recipient: IRecipient) => void
}) => {
  const [recipientAddress, setRecipientAddress] = useState<string>(recipient.address);
  const [amount, setAmount] = useState<string>(recipient.amount.toString());

  const updateRecipient = (e: any) => {
    e.preventDefault();
    onChange({
      address: recipientAddress,
      amount: parseFloat(amount),
    });
  };

  return <form onSubmit={updateRecipient}>
    <InputBase>
      <FormControl isDisabled={disabled} w="100%">
        <FormLabel htmlFor="address">Address</FormLabel>
        <Input
          type="text" value={recipientAddress}
          onChange={(e: any) => setRecipientAddress(e.target.value)}
        />
        <FormHelperText>
          The recipient&apos;s Ethereum address
          </FormHelperText>
      </FormControl>

      <FormControl isDisabled={disabled}>
        <FormLabel htmlFor="amount">Amount</FormLabel>
        <Input
          type="text" value={amount}
          onBlur={updateRecipient}
          onChange={(e: any) => setAmount(e.target.value)}
        />
        <FormHelperText>
          The amount to transfer
        </FormHelperText>
      </FormControl>
    </InputBase>
    <button style={{ display: 'none' }} type="submit" />
  </form>;
};

export default RecipientForm;
