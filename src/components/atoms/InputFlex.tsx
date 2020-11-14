/* eslint-disable react/prop-types */
import {
  Button, Flex, Input, InputGroup, InputRightElement, Text,
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
}

const OneLineTextInput: React.FC<IOneLineTextInput> = ({
  label,
  onSubmit,
  placeholder = '',
  submitLabel = 'submit',
  initialValue = '',
}: IOneLineTextInput) => {
  const [value, setValue] = useState<string>(initialValue);
  const inputName = label.toLowerCase().replaceAll(/\W/g, '-');
  return (
    <>
      <Flex>
        <Text whiteSpace="nowrap">{label}</Text>
      </Flex>
      <InputGroup as="form" size="md" w="100%"
        onSubmit={(e) => { e.preventDefault(); onSubmit(value); }}
      >
        <Input
          name={inputName}
          onChange={(e: any) => setValue(e.target.value)} value={value}
          type="text"
          placeholder={placeholder}
        />
        <InputRightElement width="6.5rem">
          <Button variantColor="teal" h="1.75rem" size="sm" type="submit">
            {submitLabel}
          </Button>
        </InputRightElement>
      </InputGroup>
    </>
  );
};
export default OneLineTextInput;
