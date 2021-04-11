import {
  Box, Flex, Text
} from '@chakra-ui/core';
import OneLineTextInput from 'components/atoms/InputFlex';
import ArweaveSearch from 'components/molecules/storage/ArweaveSearch';
import { useArweave } from 'context/Arweave';
import { downloadFromArweave } from 'modules/arweave';
import React, { useEffect, useState } from 'react';

const ArweaveTab = () => {
  const {
    arweave,
    account,
    setAccount
  } = useArweave();

  const [searchPhrase, setSearchPhrase] = useState<string>();

  const download = async (transactionId: string) => {
    downloadFromArweave({ arweave, transactionId });
  };

  useEffect(() => {
    (async () => {
      const key = localStorage.getItem("arweaveWallet");
      let jwk;
      if (key) {
        jwk = JSON.parse(key);
      } else {
        jwk = await arweave.wallets.generate();
        localStorage.setItem("arweaveWallet", JSON.stringify(jwk));
      }
      const address = await arweave.wallets.jwkToAddress(jwk);
      const balance = await arweave.wallets.getBalance(address);
      const _account = {
        privateKey: jwk,
        address,
        balance:arweave.ar.winstonToAr(balance)
      };
      setAccount(_account);
    })()
  }, [setAccount, arweave])


  return <Flex direction="column" >
     {account && <>
    <Box p="2" bg="gray.200" my="2">
        <Flex direction="row">
          <Text as="b">Wallet address: </Text>
          <Text isTruncated>{account.address}</Text>
        </Flex>
        <Flex direction="row">
        <Text as="b">AR Balance: </Text>
          <Text>{account.balance}</Text>
        </Flex>
    </Box>
    <Box>
      <OneLineTextInput onSubmit={download}
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
    </>}
  </Flex>;
};

export default ArweaveTab;
