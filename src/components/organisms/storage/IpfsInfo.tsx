import {
  Accordion, AccordionHeader, AccordionIcon, AccordionItem, AccordionPanel, Alert, AlertDescription, AlertTitle, Box, Button, CloseButton, Flex, List, ListItem, Text,
} from '@chakra-ui/core';
import OneLineTextInput, { InputBase, IOneLineTextInput } from 'components/atoms/InputFlex';
import IPFSConnectKnownAddress, { knownSwarmPeers, knownTransports } from 'components/molecules/storage/IPFSConnectKnownAddress';
import { ConfigurationDialog } from 'components/organisms/storage/PinningConfiguration';
import { useIPFS } from 'context/IPFS';
import { Ipfs } from 'ipfs';
import { IPinningServiceConfiguration } from 'modules/pinning';
import React, { useCallback, useEffect, useState } from 'react';

const ConnectInput = (props: IOneLineTextInput) => {
  const [connectionError, setConnectionError] = useState<string>();

  return <Box p="2" bg="gray.200">
    <OneLineTextInput
      {...props}
      onSubmit={async (multiAddress: string) => {
        try {
          props.onSubmit(multiAddress);
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

const IpfsInfo = ({ config, updateConfig }: {
  config: IPinningServiceConfiguration
  updateConfig: (cfg: IPinningServiceConfiguration) => void,
}) => {
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
          <ConnectInput onSubmit={swarmConnect}
            label="connect swarm peer"
            placeholder="/dns4/<domain>/tcp/<4002>/wss/p2p/<peer-id>"
            submitLabel="connect"
          />
          <InputBase>
            <Text>connect to known peers</Text>
            <IPFSConnectKnownAddress knownAddresses={knownSwarmPeers} connect={swarmConnect} />
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
          { addSwarmAddress
            && <>
              <ConnectInput
                onSubmit={addSwarmAddress}
                label="add transport"
                placeholder="/dns4/<domain>/tcp/<9090>/wss/p2p-webrtc-star/"
                submitLabel="add"
              />
              <InputBase>
                <Text>announce at known addresses:</Text>
                <IPFSConnectKnownAddress knownAddresses={knownTransports} connect={addSwarmAddress} />
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
                )}
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
