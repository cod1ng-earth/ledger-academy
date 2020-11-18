import {
  Box, Button, Flex, Heading, SimpleGrid, Text,
} from '@chakra-ui/core';
import React from 'react';
import ArweaveWalletDropZone from 'components/molecules/storage/ArweaveWalletDropZone';
import DownloadArweave from 'components/molecules/storage/DownloadArweave';
import SearchArweave from 'components/molecules/storage/SearchArweave';

export interface ArweaveWallet {
  privateKey: string;
  address: string;
  balance: number;
}

interface ArweaveTabProps {
  arweave: any,
  wallet: ArweaveWallet | undefined,
  setWallet: (wallet: ArweaveWallet) => void
}

const ArweaveTab = ({ arweave, wallet, setWallet }: ArweaveTabProps) => {
  const updateWallet = async (privateKey: string) => {
    const address = await arweave.wallets.jwkToAddress(privateKey);
    const balance = await arweave.wallets.getBalance(address);
    setWallet({ privateKey, address, balance: arweave.ar.winstonToAr(balance) });
  };

  const createWallet = async () => {
    const privateKey = await arweave.wallets.generate();
    updateWallet(privateKey);
  };

  async function walletReceived(fileName: string, data: ArrayBuffer | string | null) {
    if (data) {
      const privateKey = JSON.parse(data.toString());
      updateWallet(privateKey);
    }
  }

  return <Flex direction="column" >
    <Box p="2" bg="gray.200" my="2">
      <Heading as="h2" size="md" my="2">Wallet</Heading>
      <SimpleGrid columns={[1, 2]} spacing="2" >
          <Box w="100%">
              <Button variantColor="red" type="submit" mt="1" onClick={createWallet}>
                  Create a new wallet
              </Button>
          </Box>
          <Flex >
              <ArweaveWalletDropZone dropped={walletReceived}/>
          </Flex>
      </SimpleGrid>
      {wallet
      && <>
        <Flex direction="row">
          <Text as="b">Wallet address: </Text>
          <Text>{wallet.address}</Text>
        </Flex>
        <Flex direction="row">
        <Text as="b">AR Balance: </Text>
          <Text>{wallet.balance}</Text>
        </Flex>
      </>
      }
    </Box>
    <Box>
      <Heading size="md" my="2">Download anything</Heading>
      <DownloadArweave arweave={arweave}/>
    </Box>
    <Box>
      <Heading size="md" my="2">Search</Heading>
      <SearchArweave arweave={arweave}/>
    </Box>
  </Flex>;
};

export default ArweaveTab;
