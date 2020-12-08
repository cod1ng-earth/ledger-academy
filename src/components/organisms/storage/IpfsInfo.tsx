import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Text,
} from '@chakra-ui/core';
import { useIPFS } from 'context/IPFS';
import { Ipfs } from 'ipfs';
import React, { useCallback, useEffect, useState } from 'react';
import { checkPin } from 'modules/pinservice';
import {downloadFromArweave} from "../../../modules/arweave";

const ConnectPeer = ({ onConnected }: { onConnected: () => Promise<void> }) => {
  const { ipfsNode } = useIPFS();
  const [peer, setPeer] = useState<string>('');

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const res = await ipfsNode!.swarm.connect(peer);
    console.debug(res);
    onConnected();

    setPeer('');
  };

  return <Box p="2" bg="gray.200">
    <form onSubmit={onSubmit}>
      <InputGroup size="md">
        <Input
          name="peer"
          onChange={(e: any) => setPeer(e.target.value)} value={peer}
          type="text"
          placeholder="/dns4/ipfs.depa.digital/tcp/9091/wss/p2p-webrtc-star/p2p/QmYXq7k7zzP4sGiuHjD9YanQsLa1PjPDSj1toh2Z54iDAe"
        />
        <InputRightElement width="6.5rem">
          <Button h="1.75rem" size="sm" type="submit">
            connect
          </Button>
        </InputRightElement>
      </InputGroup>
    </form>
  </Box>;
};

const PinChecker = () => {
  const [sCid, setSCid] = useState<string>('');
  const [peerMap, setPeerMap] = useState<any[]>([]);

  const showPinInfo = async () => {
    const pinResult = await checkPin(sCid);
    setPeerMap([]);
    if (pinResult != null) {
      setPeerMap(pinResult.peer_map);
    }
  };

  return (<form onSubmit={(e) => { e.preventDefault(); showPinInfo(); }}>
    <InputGroup size="md">
      <Input
          name="cid"
          onChange={(e: any) => setSCid(e.target.value)} value={sCid}
          type="text"
          placeholder="CID"
      />
      <InputRightElement width="6.5rem">
        <Button h="1.75rem" size="sm" type="submit">
          check
        </Button>
      </InputRightElement>
    </InputGroup>
    <List>
      {Object.values(peerMap).map((peer) => (
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

const IpfsInfo = () => {
  const { ipfsNode } = useIPFS();
  const [ipfsIdentity, setIpfsIdentity] = useState<Ipfs.Id>();

  const [peers, setPeers] = useState<Ipfs.Peer[]>([]);
  const [addrs, setAddrs] = useState<Ipfs.PeerInfo[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [localAddrs, setLocalAddrs] = useState<Ipfs.Multiaddr[]>([]);

  const refresh = useCallback(async () => {
    if (!ipfsNode) return;
    const _peers = await ipfsNode.swarm.peers();

    setPeers(_peers.sort());
    setAddrs(await ipfsNode.swarm.addrs());
    setLocalAddrs(await ipfsNode.swarm.localAddrs());
    setIpfsIdentity(await ipfsNode.id());
  }, [ipfsNode]);

  useEffect(() => {
    refresh();
  }, [ipfsNode, refresh]);

  return <Box>
    <Accordion allowToggle>
      <AccordionItem>
        <AccordionHeader>
          Identity <AccordionIcon />
        </AccordionHeader>
        <AccordionPanel>
          <Text><b>ID</b> {ipfsIdentity?.id}</Text>
          <Text isTruncated><b>Public Key</b> {ipfsIdentity?.publicKey}</Text>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionHeader>Peers <AccordionIcon /></AccordionHeader>
        <AccordionPanel>
          <Button onClick={refresh}>refresh</Button>
          <List>
            {peers.map((p: Ipfs.Peer) => <ListItem key={p.peer}>{p.addr.toString()}</ListItem>)}
          </List>

          <ConnectPeer onConnected={refresh} />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionHeader>Pins <AccordionIcon /></AccordionHeader>
        <AccordionPanel>
          <PinChecker />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionHeader>
          Addresses <AccordionIcon />
        </AccordionHeader>
        <AccordionPanel>
          <List>
            {addrs.map((addr: Ipfs.PeerInfo) => <ListItem key={addr.id}>
              <Text as="b">{addr.id}</Text>
              <List ml="3">
                {addr.addrs.map((_addr: Ipfs.Multiaddr, i: number) => <ListItem key={`${addr}-${i}`}>
                  {_addr.toString()}
                </ListItem>)}
              </List>
            </ListItem>)}
          </List>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  </Box>;
};

export default IpfsInfo;
