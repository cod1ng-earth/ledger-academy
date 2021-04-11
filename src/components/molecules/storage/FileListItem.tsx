import { Box, Flex, IconButton, List, Text, useToast } from '@chakra-ui/core';
import CID from 'cids';
import { useArweave } from 'context/Arweave';
import { useIPFS } from 'context/IPFS';
import { UnixFSEntry } from 'ipfs-core/src/components/files/ls';
import { storeOnArweave } from 'modules/arweave';
import { content, download } from 'modules/download';
import { CheckPinResult, PinningApi } from 'modules/pinning';
import React, { useState } from 'react';


interface FileListItemProps {
  file: UnixFSEntry;
  pinningApi: PinningApi
}

const PinningDetails = ({
  result
}: {
  result: CheckPinResult
}) => {
  return <List ml={4}>
    {result.count === 0 && <Box>not pinned.</Box>}
    {result.rows.map( (res, i) => (
    <Flex key={res.id} mt="1" p="1" bg="gray.100" d="flex" align="center" justify="space-between">
      <Box>
        <Text as="b">
          pinned at {res.date_pinned}
        </Text>
      </Box>
    </Flex>
    ))}
  </List>;

};

const FileListItem = ({
  file,
  pinningApi
}: FileListItemProps) => {
  const { ipfsNode } = useIPFS();
  const { arweave, account } = useArweave();

  const [arweaveTransaction, setArweaveTransaction] = useState<any>();
  const [pinStatusResult, setPinStatusResult] = useState<CheckPinResult | null>();

  const toast = useToast();

  const gatewayLinkProps = {
    href: `https://ipfs.io/ipfs/${file.cid}`,
    target: '_blank',
  };

  const addToArweave = async (cid: CID, filename: string) => {
    if (!account) return;
    const ipfsContent = await content({ ipfsNode, cid });

    const transaction = await storeOnArweave({
      arweave,
      account,
      data: ipfsContent,
      tags: {
        'Content-Type': 'application/text',
        cid: cid.toString(),
        filename,
        search: 'eddie-test',
      },
    });

    setArweaveTransaction(transaction);
  };

  const showDetails = async () => {
    if (pinStatusResult) {
      setPinStatusResult(null)
      return;
    }
    setPinStatusResult(await pinningApi.checkPin(file.cid));
  }

  const requestPin = async () => {
    try {
      const res = await pinningApi.pin(file.cid);
      toast({
        title: `Pinning of ${file.cid} requested`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      console.log(res);
    } catch(error) {
      console.error(error.message);
      toast({
        status: "error",
        title: `pinning failed`,
        description: error.message,
        isClosable: true
      })
    }
  };

  return <><Flex mt="1" p="1" bg="gray.100" d="flex" align="center" justify="space-between">
      <Box>
        <Text>
          {file.name}
        </Text>
        <Text as="a" fontSize="xs" onClick={showDetails}>
          {file.cid.toString()}
        </Text>
      </Box>
      <Flex gridGap="2">
        {account && <IconButton
          variantColor="teal"
          icon="plus-square"
          aria-label="Add to Arweave"
          onClick={() => addToArweave(file.cid, file.name)}
          size="sm"
        ></IconButton>}
        {ipfsNode && <IconButton
          title="Pin"
          variantColor="teal"
          icon="attachment"
          aria-label="Pin"
          onClick={requestPin}
          size="sm"
        ></IconButton>}
        {ipfsNode && <IconButton
          variantColor="teal"
          icon="download"
          title="Download"
          aria-label="Download"
          onClick={() => download({ ipfsNode, cid: file.cid, fileName: file.name })}
          size="sm"
        ></IconButton>}
        <IconButton
          variantColor="teal"
          icon="external-link"
          title="open on gateway"
          aria-label="open on gateway"
          as="a"
          size="sm"
          {...gatewayLinkProps}
        />
      </Flex>
    </Flex>
    {pinStatusResult && (
      <>
        <PinningDetails result={pinStatusResult} />
        {arweaveTransaction && <Text fontSize="xs">Arweave ID: {arweaveTransaction.id}, Fee: {arweaveTransaction.reward}</Text>}
      </>
    )}
    </>;
};
export default FileListItem;
