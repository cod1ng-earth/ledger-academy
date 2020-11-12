import {Box, Button, Flex, Heading, SimpleGrid, Text
} from '@chakra-ui/core';
import React from 'react';
import WalletDropZone from '../../molecules/storage/WalletDropZone';
import SearchArweave from "../../molecules/storage/SearchArweave";
import DownloadArweave from "../../molecules/storage/DownloadArweave";

const IpfsArweave = (props: any) => {
  const createWallet = () => {
    props.arweave.wallets.generate().then((key: any) => {
      props.updateWallet(key);
    });
  };
  async function addData(fileName: string, data: ArrayBuffer | string | null): Promise<void> {
    if (data) {
      const key = JSON.parse(data.toString());
      props.updateWallet(key);
    }
  };
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
              <WalletDropZone addData={addData}/>
          </Flex>
      </SimpleGrid>
      <Text><b>Wallet address:</b> {props.arweaveWallet.addr}</Text>
      <Text><b>Balance AR:</b> {props.arweaveWallet.balance}</Text>
    </Box>
      <Box>
          <Heading as="h2" size="md" my="2">Download anything</Heading>
          <DownloadArweave arweave={props.arweave}/>
      </Box>
    <Box>
      <Heading as="h2" size="md" my="2">Search</Heading>
      <SearchArweave arweave={props.arweave}/>
    </Box>
  </Flex>;
};

export default IpfsArweave;
