import React, { useState } from 'react';
import { useIPFS } from 'context/IPFS';
import { CID } from 'ipfs';
import { download } from 'modules/download';
import {
  InputGroup, Input, InputRightElement, Button, Stack, List, Flex, Box, Text, Heading,
} from '@chakra-ui/core';
import { pin, checkPinStatus } from 'modules/pinservice';

const DownloadFile = () => {
  const { ipfsNode } = useIPFS();
  const [sCid, setSCid] = useState<string>('');
  const [pinStatusPeerMap, setPinStatusPeerMap] = useState<any[]>([]);

  const initiateDownload = () => {
    if (!ipfsNode) return;

    const cid = new CID(sCid);
    download({ ipfsNode, cid });
  };

  const showPinStatus = async (cid: string) => {
    const pinResult = await checkPinStatus(cid);
    setPinStatusPeerMap([]);
    if (pinResult != null) {
      setPinStatusPeerMap(pinResult.peer_map);
    }
  };

  return (<form onSubmit={(e) => { e.preventDefault(); initiateDownload(); }}>
      <InputGroup size="md">
        <Input
          name="cid"
          onChange={(e: any) => setSCid(e.target.value)} value={sCid}
          type="text"
          placeholder="CID"
        />
        <InputRightElement width="14rem">
          <Stack direction="row" spacing={2}>
            <Button h="1.75rem" size="sm" onClick={(e) => { e.preventDefault(); showPinStatus(sCid); }}>
              check
            </Button>
            <Button h="1.75rem" size="sm" onClick={(e) => { e.preventDefault(); pin(sCid); }}>
              pin
            </Button>
            <Button h="1.75rem" size="sm" type="submit">
              download
            </Button>
          </Stack>
        </InputRightElement>
      </InputGroup>
      {!Array.isArray(pinStatusPeerMap) && <Heading as="h2" size="md" my="2">Pinning clusters</Heading>}
      <List>
        {Object.values(pinStatusPeerMap).map((peer) => (
            <Flex key={peer.peername} mt="1" p="1" bg="gray.100" d="flex" align="center" justify="space-between">
              <Box>
                <Text as="b">
                  {peer.peername}
                </Text>
                <Text fontSize="xs">Status: {peer.status}</Text>
                <Text fontSize="xs">Timestamp: {peer.timestamp}</Text>
              </Box>
            </Flex>))}
      </List>
    </form>);
};

export default DownloadFile;
