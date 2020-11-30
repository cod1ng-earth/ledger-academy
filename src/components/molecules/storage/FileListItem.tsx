import React, { useState, useEffect } from 'react';
import { Ipfs } from 'ipfs';
import { useIPFS } from 'context/IPFS';
import {
  Flex, Box, Text, IconButton, List, useToast,
} from '@chakra-ui/core';
import { ArweaveWallet } from 'components/organisms/storage/ArweaveTab';
import { storeOnArweave } from 'modules/arweave';
import { PinningApi } from 'modules/pinning';
import { content, download } from 'modules/download';

interface FileListItemProps {
  file: any;
  arweave: any;
  arweaveWallet: ArweaveWallet | undefined;
  pinningApi: PinningApi;
}

interface IPinningPeer {
  peername: string;
  status: string;
  timestamp: string;
}

const FileItemDetails = ({
  file, pinningApi,
}: {
  file: Ipfs.UnixFSLsResult, pinningApi: PinningApi
}) => {
  const [pinStatus, setPinStatus] = useState<{[key: string]: IPinningPeer}>({});

  useEffect(() => {
    (async () => {
      const pinResult = await pinningApi.checkPin(file.cid.toString());
      setPinStatus(pinResult.peer_map);
    })();
  }, []);

  return <List ml={4}>
    {Object.values(pinStatus).map((pinningPeer: IPinningPeer) => (
        <Flex key={pinningPeer.peername} mt="1" p="1" bg="gray.100" d="flex" align="center" justify="space-between">
          <Box>
            <Text as="b">
              {pinningPeer.peername}
            </Text>
            <Text fontSize="xs">Status: {pinningPeer.status}</Text>
            <Text fontSize="xs">Timestamp: {pinningPeer.timestamp}</Text>
          </Box>
        </Flex>))
    }
  </List>;
};

const FileListItem = ({
  file, arweave, arweaveWallet, pinningApi,
}: FileListItemProps) => {
  const { ipfsNode } = useIPFS();

  const [arweaveTransaction, setArweaveTransaction] = useState<any>();
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const toast = useToast();

  const sCid = file.cid.toString();

  const gatewayLinkProps = {
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

  const requestPin = async () => {
    const res = await pinningApi.pin(sCid);
    toast({
      title: `Pinning of ${sCid} requested`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    console.log(res);
  };

  return <><Flex mt="1" p="1" bg="gray.100" d="flex" align="center" justify="space-between">
      <Box>
        <Text>
          {file.name}
        </Text>
        <Text as="a" fontSize="xs" onClick={() => setShowDetails(!showDetails)}>{sCid}</Text>
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
          icon="attachment"
          aria-label="Pin"
          onClick={requestPin}
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
          {...gatewayLinkProps}
        />
      </Flex>
    </Flex>
    {showDetails && <FileItemDetails file={file} pinningApi={pinningApi} />}
    </>;
};
export default FileListItem;
