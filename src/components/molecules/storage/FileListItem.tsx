import {
  Box, Flex, IconButton, Text,
} from '@chakra-ui/core';
import { ArweaveWallet } from 'components/organisms/storage/ArweaveTab';
import { useIPFS } from 'context/IPFS';
import { storeOnArweave } from 'modules/arweave';
import { content, download } from 'modules/download';
import React, { useState } from 'react';

interface FileListItemProps {
  file: any;
  arweave: any;
  arweaveWallet: ArweaveWallet | undefined;
}

const FileListItem = ({ file, arweave, arweaveWallet }: FileListItemProps) => {
  const { ipfsNode } = useIPFS();

  const [arweaveTransaction, setArweaveTransaction] = useState<any>();

  const sCid = file.cid.toString();
  const linkProps = {
    href: `https://ipfs.io/ipfs/${sCid}`,
    target: '_blank',
  };

  const addToArweave = async (cid: string, filename: string) => {
    if (!arweaveWallet) return;
    const ipfsContent = await content({ ipfsNode, cid });

    const transaction = await storeOnArweave({
      arweave,
      wallet: arweaveWallet,
      data: ipfsContent,
      tags: {
        'Content-Type': 'application/text',
        cid,
        filename,
        search: 'eddie-test',
      },
    });

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
        {arweaveWallet && <IconButton
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
