import {
  Accordion, AccordionHeader, AccordionIcon, AccordionItem, AccordionPanel, Alert, AlertDescription, AlertTitle, Box, Button, ButtonGroup, CloseButton, Flex, List, ListItem, Text, Tooltip,
} from '@chakra-ui/core';
import OneLineTextInput, { InputBase } from 'components/atoms/InputFlex';
import { useIPFS } from 'context/IPFS';
import { Ipfs } from 'ipfs';
import Multiaddr from 'multiaddr';
import React, { useCallback, useEffect, useState } from 'react';

const knownPeers = [
  {
    name: 'Coding.Earth WSS',
    address: '/dnsaddr/ipfs.coding.earth/tcp/4002/wss/p2p/12D3KooWPMH57dcaZPjw9MjF7q8hZgf446s6g4s9BbX1BGRztwTC',
  },
  {
    name: 'Depa Digital WSS',
    address: '/dns4/ipfs.depa.digital/tcp/4002/wss/p2p/QmXAghnP7DqmAEE7Zx4SxMo3UcUVSn8f1xDCT6x1ysYMSj',
  },

];

const knownTransports = [
  {
    name: 'Coding.Earth Web RTC Star',
    address: '/dns4/ipfs.coding.earth/tcp/9090/wss/p2p-webrtc-star/',
  },
  {
    name: 'Depa.Digital Web RTC Star',
    address: '/dns4/ipfs.depa.digital/tcp/9091/wss/p2p-webrtc-star/',
  },
];

const ConnectInput = ({ onSubmitted }: {
  onSubmitted: (address: string) => Promise<string | void>
}) => {
  const [connectionError, setConnectionError] = useState<string>();

  return <Box p="2" bg="gray.200">
    <OneLineTextInput
      label="connect"
      placeholder="<your id>"
      submitLabel="connect"
      onSubmit={async (multiAddress: string) => {
        try {
          onSubmitted(multiAddress);
        } catch (e) {
          setConnectionError(e.message);
        }
      }}
    />
    {connectionError && <Alert status="error">
      <AlertTitle>Connection Error</AlertTitle>
      <AlertDescription>{connectionError}</AlertDescription>
      <CloseButton onClick={() => setConnectionError(undefined)} />
    </Alert>}
  </Box>;
};

const PeerInfo = ({ addr }: {addr: Ipfs.Multiaddr}) => {
  const _addr = addr.toString();
  const components = _addr.split('/');

  return <ListItem>
    <Flex gridGap={2}>
    {components.map((c, i) => (
      <React.Fragment key={`peerinfo-${_addr}-${i}`}>
        <Text >{c}</Text>
        <Text>/</Text>
      </React.Fragment>
    ))
    }
    </Flex>
  </ListItem>;
};

const IpfsInfo = () => {
  const { ipfsNode, addSwarmAddress } = useIPFS();
  const [ipfsIdentity, setIpfsIdentity] = useState<Ipfs.Id>();

  const [peers, setPeers] = useState<Ipfs.Peer[]>([]);
  const [addrs, setAddrs] = useState<Ipfs.PeerInfo[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [localAddrs, setLocalAddrs] = useState<Ipfs.Multiaddr[]>([]);

  const refresh = useCallback(async () => {
    if (!ipfsNode) return;
    console.debug('refresh');

    const _peers = await ipfsNode.swarm.peers();

    setPeers(_peers.sort());
    setAddrs(await ipfsNode.swarm.addrs());
    setLocalAddrs(await ipfsNode.swarm.localAddrs());
    setIpfsIdentity(await ipfsNode.id());
  }, [ipfsNode]);

  useEffect(() => {
    refresh();
  }, [ipfsNode, refresh]);

  const swarmConnect = async (peer: string): Promise<string | void> => {
    await ipfsNode!.swarm.connect(peer);
    refresh();
  };

  const addTransport = async (transport: string): Promise<string | void> => {
    const multiAddr = Multiaddr(transport);

    addSwarmAddress!(multiAddr.toString());

    // this is supposed to work but doesn't (dynamically, ipfs 0.47):
    // const res = ipfsNode!.libp2p.transportManager.listen(multiAddr);
  };

  return <Box>
    <Accordion allowToggle>
      <AccordionItem>
        <AccordionHeader>
          Identity <AccordionIcon />
        </AccordionHeader>
        <AccordionPanel>
          <Text><b>ID</b> {ipfsIdentity?.id}</Text>
          <Text isTruncated><b>Public Key</b> {ipfsIdentity?.publicKey}</Text>
          <Text><b>Version</b> {ipfsIdentity?.agentVersion} / <b>Protocol</b>: {ipfsIdentity?.protocolVersion} </Text>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionHeader>
          Peers <AccordionIcon />
        </AccordionHeader>
        <AccordionPanel>

          <ConnectInput onSubmitted={swarmConnect} />
          <InputBase>
            <Text>connect to known peers</Text>
            <ButtonGroup>
              {
                knownPeers.map((peer) => <Tooltip
                key={`connect-${peer.address}`}
                label={peer.address}
                aria-label={peer.address}
                placement="bottom"
              >
                <Button
                  variantColor="teal"
                  onClick={() => swarmConnect(peer.address)}>
                  {peer.name}
                </Button>
                </Tooltip>)
              }
            </ButtonGroup>
            </InputBase>
          <List ml="3">
            {peers.map((p: Ipfs.Peer) => <PeerInfo key={p.addr.toString()} addr={p.addr} />)}
          </List>

          <Button onClick={refresh} variantColor="teal">refresh</Button>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionHeader>
          Addresses <AccordionIcon />
        </AccordionHeader>
        <AccordionPanel>
          {

            addSwarmAddress && <>
              <ConnectInput onSubmitted={addTransport} />
              <InputBase>
                <Text>announce at known addresses:</Text>
                <ButtonGroup>
                  {
                    knownTransports.map((peer) => <Tooltip
                      key={`addtransport-${peer.address}`}
                      label={peer.address}
                      aria-label={peer.address}
                      placement="bottom"
                    >
                      <Button
                        variantColor="teal"
                        onClick={() => addTransport(peer.address)}>
                        {peer.name}
                      </Button>
                    </Tooltip>)
                  }
                </ButtonGroup>
              </InputBase>
            </>
          }

          <List>
            {addrs.map((addr: Ipfs.PeerInfo) => <ListItem key={addr.id}>
              <Text as="b">{addr.id}</Text>
              <List ml="3">
                {addr.addrs.map(
                  (_addr: Ipfs.Multiaddr, i: number) => (
                    <PeerInfo key={`pi-${addr.id}-${i}`} addr={_addr} />
                  ),
                )
                }
              </List>
            </ListItem>)}
          </List>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  </Box>;
};

export default IpfsInfo;
