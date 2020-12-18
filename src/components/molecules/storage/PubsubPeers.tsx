import React, { useEffect, useState } from 'react';
import { useIPFS } from 'context/IPFS';
import {
  Box, Heading, List, ListItem,
} from '@chakra-ui/core';

const PubsubPeers = ({ topic }: { topic: string }) => {
  const { ipfsNode } = useIPFS();
  const [subscribedPeers, setSubscribedPeers] = useState<string[]>([]);

  useEffect(() => {
    if (!ipfsNode) return () => { };
    const intvl = setInterval(async () => {
      if (ipfsNode?.pubsub) {
        const peerIds = await ipfsNode.pubsub.peers(topic);
        setSubscribedPeers(peerIds);
      } else {
        console.debug('node went down in the meanwhile...');
      }
    }, 2000);
    return () => {
      clearInterval(intvl);
    };
  }, [ipfsNode, topic]);

  return <Box my="3">
    <Heading size="md">Subscribed Peers</Heading>
    <List>
      {subscribedPeers.map((p) => (<ListItem key={p}>{p}</ListItem>))}
    </List>
  </Box>;
};

export default PubsubPeers;
