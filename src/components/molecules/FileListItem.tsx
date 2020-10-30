import React from 'react';
import { Ipfs } from 'ipfs';
import { useIPFS } from 'context/IPFS';
import {
  Flex, Box, Text, IconButton,
} from '@chakra-ui/core';
import { download } from 'modules/download';

const FileListItem = ({ file }: {file: Ipfs.UnixFSLsResult}) => {
  const { ipfsNode } = useIPFS();

  const sCid = file.cid.toString();
  const linkProps = {
    href: `https://ipfs.io/ipfs/${sCid}`,
    target: '_blank',
  };

  return <Flex mt="1" p="1" bg="gray.100" d="flex" align="center" justify="space-between">
      <Box>
        <Text as="b">
          {file.name}
        </Text>
        <Text fontSize="xs">{sCid}</Text>
      </Box>
      <Flex gridGap="2">
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
