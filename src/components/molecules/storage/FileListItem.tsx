import React, { useState } from 'react';
import { Ipfs } from 'ipfs';
import { useIPFS } from 'context/IPFS';
import {
  Flex, Box, Text, IconButton,
} from '@chakra-ui/core';
import { download, content } from 'modules/download';

const FileListItem = ({ file, arweave, arweaveWallet }: {file: Ipfs.UnixFSLsResult, arweave: any, arweaveWallet: any}) => {
  const { ipfsNode } = useIPFS();

  const [arweaveTransaction, setArweaveTransaction] = useState<any>(null);

  const sCid = file.cid.toString();
  const linkProps = {
    href: `https://ipfs.io/ipfs/${sCid}`,
    target: '_blank',
  };

  const addToArweave = async (cid: string, filename: string) => {
    const ipfsContent = await content({ipfsNode: ipfsNode, cid: cid});
    let transaction = await arweave.createTransaction({data: ipfsContent}, arweaveWallet.key);
    transaction.addTag('Content-Type', 'application/text');
    transaction.addTag('cid', cid);
    transaction.addTag('filename', filename);
    transaction.addTag('search', 'eddie-test');
    await arweave.transactions.sign(transaction, arweaveWallet.key);
    const response = await arweave.transactions.post(transaction);

    setArweaveTransaction(transaction);
  };

  return <Flex mt="1" p="1" bg="gray.100" d="flex" align="center" justify="space-between">
      <Box>
        <Text as="b">
          {file.name}
        </Text>
        <Text fontSize="xs">{sCid}</Text>
        {arweaveTransaction && <Text fontSize="xs">Arweave ID: {arweaveTransaction.id}, Fee: {arweaveTransaction.reward}</Text>}
      </Box>
      <Flex gridGap="2">
        {arweaveWallet.key && <IconButton
          variantColor="teal"
          icon="plus-square"
          aria-label="Add to Arweave"
          onClick={() => addToArweave(sCid, file.name)}
          size="sm"
        ></IconButton>}
        {ipfsNode && <IconButton
        variantColor="teal"
          icon="download"
          aria-label="Download"
          onClick={() => download({ ipfsNode, cid: file.cid, fileName: file.name })}
          size="sm"
        ></IconButton>}
        <IconButton
        variantColor="teal"
          icon="external-link"
          aria-label="open on gateway"
          as="a"
          size="sm"
          {...linkProps}
        />
      </Flex>
    </Flex>;
};
export default FileListItem;
