import React, { useState } from 'react';
import { Ipfs } from 'ipfs';
import { useIPFS } from 'context/IPFS';
import {
  Flex, Box, Text, IconButton,
} from '@chakra-ui/core';
import { download, content } from 'modules/download';
import { ArweaveWallet } from 'components/organisms/storage/ArweaveTab';
import { storeOnArweave } from 'modules/arweave';
import fetch from 'cross-fetch';

interface FileListItemProps {
  file: Ipfs.UnixFSLsResult;
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

  const pin = async (node: any, cid: string) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Basic ${process.env.REACT_APP_PIN_SERVICE_AUTHORIZATION}');
    try {
      const response = await fetch(process.env.REACT_APP_PIN_SERVICE_HOST + '/pins/' + cid, {
        method: 'POST',
        headers: myHeaders,
        mode: 'no-cors',
        redirect: 'follow',
      });

      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }

      const result = await response.json();
      console.log(result);
    } catch (err) {
      console.error(err);
    }
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
            icon="check"
            aria-label="Pin"
            onClick={() => pin(ipfsNode, sCid)}
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
