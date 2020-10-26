import {
  Flex, FormControl, FormHelperText, FormLabel, Input,
} from '@chakra-ui/core';
import React, { useState } from 'react';

export interface IRecipient {
    address: string,
    amount: string,
  }

const RecipientForm = ({ disabled, recipient, onChange }: {
    disabled: boolean,
    recipient: IRecipient,
    onChange: (address: string, recipient: IRecipient) => void
  }) => {
  const [_recipient, setRecipient] = useState<IRecipient>(recipient);

  const updateRecipient = (e: any) => {
    e.preventDefault();
    onChange(recipient.address, _recipient);
  };

  // useEffect(() => {
  //   if (_recipient.address !== '') { onChange(recipient.address, _recipient); }
  // }, [_recipient]);

  return <form>
      <Flex direction="row" align="flex-stretch">

        <FormControl isDisabled={disabled}>
          <FormLabel htmlFor="address">Address</FormLabel>
          <Input
            type="text" value={_recipient.address}
            onBlur={updateRecipient}
            onChange={(e: any) => setRecipient({ ..._recipient, address: e.target.value })}
          />
          <FormHelperText>
            The recipient&apos;s Ethereum address
          </FormHelperText>
        </FormControl>

        <FormControl isDisabled={disabled}>
          <FormLabel htmlFor="amount">Amount</FormLabel>
          <Input
            type="text" value={_recipient.amount}
            onBlur={updateRecipient}
            onChange={(e: any) => setRecipient({ ..._recipient, amount: e.target.value })}
          />
          <FormHelperText>
            The amount to transfer
          </FormHelperText>
        </FormControl>
      </Flex>
    </form>;
};

export default RecipientForm;
