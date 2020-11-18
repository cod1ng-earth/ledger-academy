import {
  Box, Button, Flex, Heading, SimpleGrid, Text,
} from '@chakra-ui/core';
import OneLineTextInput from 'components/atoms/InputFlex';
import ArweaveSearch from 'components/molecules/storage/ArweaveSearch';
import ArweaveWalletDropZone from 'components/molecules/storage/ArweaveWalletDropZone';
import { downloadFromArweave } from 'modules/arweave';
import React, { useState } from 'react';

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
  const [searchPhrase, setSearchPhrase] = useState<string>();
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

  const startDownload = async (transactionId: string) => {
    downloadFromArweave({ arweave, transactionId });
  };

  return <Flex direction="column" >
    <Box p="2" bg="gray.200" my="2">
      <SimpleGrid columns={[1, 2]} spacing="2" >
          <Button variantColor="red" type="submit" mt="1" onClick={createWallet}>
              Create a new wallet
          </Button>
          <ArweaveWalletDropZone dropped={walletReceived}/>
      </SimpleGrid>
      {wallet
      && <>
        <Flex direction="row">
          <Text as="b">Wallet address: </Text>
          <Text isTruncated>{wallet.address}</Text>
        </Flex>
        <Flex direction="row">
        <Text as="b">AR Balance: </Text>
          <Text>{wallet.balance}</Text>
        </Flex>
      </>
      }
    </Box>
    <Box>
      <OneLineTextInput onSubmit={startDownload}
        placeholder="some transaction id"
        label="Dowload from Arweave"
        submitLabel="download"
      />
    </Box>
    <Box>
      <OneLineTextInput onSubmit={setSearchPhrase}
        placeholder="filename, cid, type, tag"
        label="Search on Arweave"
        submitLabel="search"
      />
      {searchPhrase && <ArweaveSearch arweave={arweave} searchPhrase={searchPhrase}/>}
    </Box>
  </Flex>;
};

export default ArweaveTab;
