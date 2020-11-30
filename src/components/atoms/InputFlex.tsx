/* eslint-disable react/prop-types */
import {
  Button, Flex, Input, Text,
} from '@chakra-ui/core';
import { FlexProps } from '@chakra-ui/core/dist/Flex';
import React, { useState } from 'react';

export const InputBase: React.FC<FlexProps> = (props) => (
  <Flex {...props}
    w="100%"
    gridGap="2" bg="gray.200"
    p="3" mb="3"
    align="center"
    justify="space-between"
    borderBottomWidth="2px"
    borderBottomColor="gray.400">{props.children}</Flex>
);

export interface IOneLineTextInput {
  label: string,
  onSubmit: (value: string) => any,
  placeholder?: string,
  submitLabel?: string,
  initialValue?: string,
  isDisabled?: boolean,
  reset?: boolean,
}

const OneLineTextInput: React.FC<IOneLineTextInput> = ({
  label,
  onSubmit,
  placeholder = '',
  submitLabel = 'submit',
  initialValue = '',
  isDisabled = false,
  reset = true,
}: IOneLineTextInput) => {
  const [value, setValue] = useState<string>(initialValue);
  const inputName = label.toLowerCase().replaceAll(/\W/g, '-');

  const submit = (e: any) => {
    e.preventDefault();
    onSubmit(value);
    if (reset) {
      setValue('');
    }
  };

  return (
    <Flex direction="column" align="flex-start" w="100%">
      <Text whiteSpace="nowrap" p={1}>{label}</Text>
      <Flex direction="row" w="100%" as="form" onSubmit={submit}>
      <Input
        name={inputName}
        onChange={(e: any) => setValue(e.target.value)} value={value}
        type="text"
        placeholder={placeholder}
        isDisabled={isDisabled}
      />
      <Button
        isDisabled={isDisabled}
        variantColor="teal"

        type="submit">
        {submitLabel}
      </Button>
      </Flex>
    </Flex>
  );
};
export default OneLineTextInput;
