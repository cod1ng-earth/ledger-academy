/* eslint-disable react/prop-types */
import {
  Button, Flex, FormLabel, Input, InputGroup, InputRightElement,
} from '@chakra-ui/core';
import { FlexProps } from '@chakra-ui/core/dist/Flex';
import React, { useState } from 'react';

export const InputBase: React.FC<FlexProps> = (props) => (
  <Flex {...props}
    justify="space-between" w="100%"
    gridGap="2" bg="gray.200"
    p="3" mb="3"
    borderBottomWidth="2px"
    borderBottomColor="gray.400">{props.children}</Flex>
);

export interface IOneLineTextInput {
  label: string,
  onSubmit: (value: string) => any,
  placeholder?: string,
  submitLabel?: string,
  initialValue?: string,
}
const OneLineTextInput: React.FC<IOneLineTextInput> = ({
  label,
  onSubmit,
  placeholder = '',
  submitLabel = '',
  initialValue = '',
}: IOneLineTextInput) => {
  const [value, setValue] = useState<string>(initialValue);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(value); }}>
      <InputGroup size="md">
        <FormLabel>{label}</FormLabel>
        <Input
          name={label.toLowerCase().replaceAll(/\W/g, '-')}
          onChange={(e: any) => setValue(e.target.value)} value={value}
          type="text"
          placeholder={placeholder}
        />
        <InputRightElement width="6.5rem">
          <Button h="1.75rem" size="sm" type="submit">
            {submitLabel}
          </Button>
        </InputRightElement>
      </InputGroup>
    </form>
  );
};
export default OneLineTextInput;
