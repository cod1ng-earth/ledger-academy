import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  List,
  ListItem,
  Text,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Alert,
} from '@chakra-ui/core';
import { useIPFS } from 'context/IPFS';
import { Ipfs } from 'ipfs';
import React, { useCallback, useEffect, useState } from 'react';
import { ConfigurationDialog } from 'components/organisms/storage/PinningConfiguration';
import { IPinningServiceConfiguration } from 'modules/pinning';
import OneLineTextInput from 'components/atoms/InputFlex';
import Multiaddr from 'multiaddr';

const ConnectPeer = ({ onConnected }: { onConnected: () => Promise<void> }) => {
  const { ipfsNode } = useIPFS();
  const [connectionError, setConnectionError] = useState<string>();
  const addPeer = async (peer: string) => {
    try {
      // const res = const res = await ipfsNode!.swarm.connect(_peer);
      // /dns4/ipfs.depa.digital/tcp/9091/wss/p2p-webrtc-star
      const res = ipfsNode!.libp2p.transportManager.listen(Multiaddr(peer));
      console.debug(res);
      onConnected();
      setConnectionError('');
    } catch (e) {
      setConnectionError(e.message);
    }
  };

  return <Box p="2" bg="gray.200">
    <OneLineTextInput
      label="swarm connect any peer"
      placeholder="/dns4/ipfs.depa.digital/tcp/9091/wss/p2p-webrtc-star/<your id>"
      submitLabel="connect"
      onSubmit={addPeer}
    />
    {connectionError && <Alert status="error">
      <AlertTitle>Connection Error</AlertTitle>
      <AlertDescription>{connectionError}</AlertDescription>
      <CloseButton onClick={() => setConnectionError(undefined)} />
    </Alert>}
  </Box>;
};

const IpfsInfo = ({ config, updateConfig }: {
  config: IPinningServiceConfiguration
  updateConfig: (cfg: IPinningServiceConfiguration) => void,
}) => {
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
        <AccordionHeader>Peers
          <AccordionIcon />
        </AccordionHeader>
        <AccordionPanel>

          <ConnectPeer onConnected={refresh} />
          <List>
            {peers.map((p: Ipfs.Peer) => (
              <ListItem key={p.peer}>{p.addr.toString()}</ListItem>
            )) }
          </List>
          <Button onClick={refresh} variantColor="teal">refresh</Button>
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
    <Box mt={12}>
      <ConfigurationDialog config={config} updateConfig={updateConfig} />
    </Box>
  </Box>;
};

export default IpfsInfo;
