import {
  Accordion, AccordionHeader, AccordionIcon, AccordionItem, AccordionPanel, Alert, AlertDescription, AlertTitle, Box, Button, CloseButton, ListItem, Text, useClipboard, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, IconButton,
} from '@chakra-ui/core';
import OneLineTextInput, { InputBase, IOneLineTextInput } from 'components/atoms/InputFlex';
import IPFSConnectKnownAddress, { knownSwarmPeers, knownTransports } from 'components/molecules/storage/IPFSConnectKnownAddress';
import { ConfigurationDialog } from 'components/organisms/storage/PinningConfiguration';
import { useIPFS } from 'context/IPFS';
import { Ipfs } from 'ipfs';
import { IPinningServiceConfiguration } from 'modules/pinning';
import React, { useCallback, useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import QrReader from 'react-qr-scanner';

import { IoQrCode } from 'react-icons/io5';

const ConnectInput = (props: IOneLineTextInput) => {
  const [connectionError, setConnectionError] = useState<string>();

  return <Box p="2" bg="gray.200">
    <OneLineTextInput
      {...props}
      onSubmit={async (multiAddress: string) => {
        try {
          await props.onSubmit(multiAddress);
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
  // const components = _addr.split('/');
  const { onCopy } = useClipboard(_addr);

  return <Text isTruncated onClick={onCopy}>{_addr}</Text>;
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

  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [qrCodeContent, setQRCodeContent] = useState<string>('');
  const [scanningForRelayPeer, setScanningForRelayPeer] = useState<string>('');

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

  const swarmConnect = async (peer: string): Promise<any> => {
    await ipfsNode!.swarm.connect(peer);
    refresh();
  };

  const circuitConnect = (circuitPeer: string, peerId: string) => {
    const peer = `${circuitPeer}/p2p-circuit/p2p/${peerId}`;
    swarmConnect(peer);
    setScanningForRelayPeer('');
  };

  const showQrCode = (content: string) => {
    setQRCodeContent(content);
    setIsQrModalOpen(true);
  };

  return <Box>
    <Modal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Scan this</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <QRCode value={qrCodeContent} size={400} includeMargin={true} />
          </ModalBody>
        </ModalContent>
      </Modal>

    <Accordion allowToggle>
      <AccordionItem>
        <AccordionHeader>
          Identity <AccordionIcon />
        </AccordionHeader>
        <AccordionPanel>
          <Text>
            <b>ID</b> {ipfsIdentity?.id}
            <IconButton
              size="sm"
              mx={2}
              aria-label="scan ipfs id" icon={IoQrCode}
              onClick={() => showQrCode(ipfsIdentity?.id || '')}
            />
          </Text>
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
          <InputBase justifyContent="space-between">
            <Box>
              <Text>connect via circuit relay</Text>
              {
                scanningForRelayPeer ? <Button
                  variantColor="teal"
                  leftIcon={IoQrCode}
                  size="sm"
                  onClick={() => setScanningForRelayPeer('')}
                >stop</Button>
                  : knownSwarmPeers.map((peer) => <Button key={`scanPeer-${peer.name}`}
                variantColor="teal"
                leftIcon={IoQrCode}
                size="sm"
                onClick={() => { setScanningForRelayPeer(peer.address); } }
              >{peer.name}
              </Button>)
            }
            </Box>
            <Box>
              <Text>connect to known peers</Text>
              <IPFSConnectKnownAddress knownAddresses={knownSwarmPeers} connect={swarmConnect} />
            </Box>
          </InputBase>

          <Box>
          {
            scanningForRelayPeer && <QrReader
            onScan={(peerId: string) => {
              if (peerId) {
                circuitConnect(scanningForRelayPeer, peerId);
              }
            }}
            onError={console.error}
            facingMode="rear"
            />
          }
          </Box>

          <Box>
            {peers.map((p: Ipfs.Peer) => <PeerInfo key={p.addr.toString()} addr={p.addr} />)}
          </Box>

          <Button leftIcon="repeat" onClick={refresh} variantColor="teal" >refresh</Button>
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
              <InputBase justifyContent="flex-end">
                <Text>announce at known addresses:</Text>
                <IPFSConnectKnownAddress knownAddresses={knownTransports} connect={addSwarmAddress} />
              </InputBase>
            </>
          }

          <Box>
            {addrs.map((addr: Ipfs.PeerInfo) => <ListItem key={addr.id}>
              <Text as="b">{addr.id}</Text>

                {addr.addrs.map(
                  (_addr: Ipfs.Multiaddr, i: number) => (
                    <PeerInfo key={`pi-${addr.id}-${i}`} addr={_addr} />
                  ),
                )}

            </ListItem>)}
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
    <Box mt={12}>
      <ConfigurationDialog config={config} updateConfig={updateConfig} />
    </Box>
  </Box>;
};

export default IpfsInfo;
