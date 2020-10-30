import { Flex, Link, Text } from '@chakra-ui/core';
import React from 'react';

export const EthBalance = ({ balance }: {
    balance: string
  }) => <Flex p={2} border="1px solid" borderColor="gray.400" direction="column">
      <Text>Your Eth balance</Text>
      <Text fontSize="3xl" fontWeight="bold" isTruncated>{balance} Ξ</Text>
  </Flex>;

export const AdiBalance = ({ network, balance, contract }: {
    network: string,
    balance: string,
    contract: any
  }) => {
  const networkExplorerUrl = `https://${network === 'main' ? '' : network}.etherscan.io`;
  const explorerLink = `${networkExplorerUrl}/address/${contract.options.address}`;

  return <Flex p={2} border="1px solid" borderColor="gray.400" direction="column">
        <Text>Your ADI balance</Text>
        <Text fontSize="3xl" fontWeight="bold">{balance} Å</Text>
        <Link href={explorerLink} isExternal fontSize="xs">{contract.options.address}</Link>
    </Flex>;
};
