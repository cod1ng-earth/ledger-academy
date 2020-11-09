import React from 'react';
import { Flex } from '@chakra-ui/core';
import { FlexProps } from '@chakra-ui/core/dist/Flex';

const InputFlex:React.FC<FlexProps> = (props) => <Flex {...props} justify="space-between" w="100%" gridGap="2" bg="gray.200" p="3" mb="3" borderBottomWidth="2px" borderBottomColor="gray.400" />;
export default InputFlex;
