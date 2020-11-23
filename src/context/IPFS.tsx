import { create as createIpfs, Ipfs } from 'ipfs';
import IPFSClient from 'ipfs-message-port-client';
import React, { useContext, useEffect, useState } from 'react';

interface IIpfsContext {
  ipfsClient?: IPFSClient | null,
  ipfsNode?: Ipfs,
  addSwarmAddress?: (address: string) => any
}

const IpfsContext = React.createContext<IIpfsContext>({});

const useIPFS = () => useContext(IpfsContext);

const IPFSProvider = ({ children }: any) => {
  const [ipfsClient, setIpfsClient] = useState<IPFSClient>();
  const [ipfsNode, setIpfsNode] = useState<Ipfs>();
  const [swarmAddresses, setSwarmAddresses] = useState<string[]>([]);

  const addSwarmAddress = async (addr: string) => {
    if (ipfsNode) {
      await ipfsNode.stop();
    }
    console.log('restarting with new address', addr);
    setSwarmAddresses((oldAddresses: string[]) => [
      ...oldAddresses,
      addr,
    ]);
  };

  useEffect(() => {
    if (!window.SharedWorker) { return; }
    const worker = new SharedWorker('/ipfsWorker.js', { type: 'module', name: 'ipfs-worker' });
    const client = IPFSClient.from(worker.port);
    setIpfsClient(client);
  }, []);

  useEffect(() => {
    (async () => {
      const _ipfsNode = await createIpfs({
        repo: 'ipfs-node',
        config: {
          Addresses: {
            Swarm: swarmAddresses,
          },
        },
      });
      // '/dns4/ipfs.coding.earth/tcp/9090/wss/p2p-webrtc-star/',
      // _ipfsNode.swarm.connect('/ip4/167.71.52.88/tcp/4002/wss/p2p/QmXAghnP7DqmAEE7Zx4SxMo3UcUVSn8f1xDCT6x1ysYMSj');

      // _ipfsNode.swarm.connect('/dnsaddr/ipfs.3box.io/tcp/443/wss/p2p/QmZvxEpiVNjmNbEKyQGvFzAY1BwmGuuvdUTmcTstQPhyVC');
      // _ipfsNode.swarm.connect('/dnsaddr/ipfs.coding.earth/tcp/4002/wss/p2p/12D3KooWPMH57dcaZPjw9MjF7q8hZgf446s6g4s9BbX1BGRztwTC');

      /// dns4/ipfs.depa.digital/tcp/9091/wss/p2p-webrtc-star
      // _ipfsNode.libp2p.transportManager.listen(multiaddr('/dns4/ipfs.depa.digital/tcp/9091/wss/p2p-webrtc-star/')).catch(console.warn);
      // /dns4/ipfs.depa.digital/tcp/9091/wss/p2p-webrtc-star/QmPLjRDFb8YgjMsP4XpccWT9EwPGvfSw87KCgMWa2haFCi
      const _ipfsId = await _ipfsNode.id();
      console.log('ipfs node (v%s) is running [id: %s]', _ipfsId.agentVersion, _ipfsId.id);
      setIpfsNode(_ipfsNode);
    })();
  }, [swarmAddresses]);

  return (
    <IpfsContext.Provider value={{ ipfsClient, ipfsNode, addSwarmAddress }}>
      {children}
    </IpfsContext.Provider>
  );
};

export { IPFSProvider, useIPFS };
