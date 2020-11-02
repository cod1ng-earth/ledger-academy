import { create as createIpfs, Ipfs } from 'ipfs';
import IPFSClient from 'ipfs-message-port-client';
import React, { useContext, useEffect, useState } from 'react';

interface IIpfsContext {
  ipfsClient?: IPFSClient | null,
  ipfsNode?: Ipfs,
}

const IpfsContext = React.createContext<IIpfsContext>({});

const useIPFS = () => useContext(IpfsContext);

const IPFSProvider = ({ children }: any) => {
  const [ipfsClient, setIpfsClient] = useState<IPFSClient>();
  const [ipfsNode, setIpfsNode] = useState<Ipfs>();

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
            Swarm: ['/dns4/ipfs.depa.digital/tcp/9091/wss/p2p-webrtc-star'],
          },
        },
      });
      // _ipfsNode.swarm.connect('/ip4/167.71.52.88/tcp/4002/wss/p2p/QmXAghnP7DqmAEE7Zx4SxMo3UcUVSn8f1xDCT6x1ysYMSj');
      _ipfsNode.swarm.connect('/dns4/ipfs.depa.digital/tcp/4002/wss/p2p/QmXAghnP7DqmAEE7Zx4SxMo3UcUVSn8f1xDCT6x1ysYMSj');
      _ipfsNode.swarm.connect('/dnsaddr/ipfs.3box.io/tcp/443/wss/p2p/QmZvxEpiVNjmNbEKyQGvFzAY1BwmGuuvdUTmcTstQPhyVC');
      // _ipfsNode.libp2p.transportManager.listen(multiaddr('/dns4/ipfs.depa.digital/tcp/9091/wss/p2p-webrtc-star/')).catch(console.warn);

      const _ipfsId = await _ipfsNode.id();
      console.log('ipfs node (v%s) is running [id: %s]', _ipfsId.agentVersion, _ipfsId.id);
      setIpfsNode(_ipfsNode);
    })();
  }, []);

  return (
    <IpfsContext.Provider value={{ ipfsClient, ipfsNode }}>
      {children}
    </IpfsContext.Provider>
  );
};

export { IPFSProvider, useIPFS };
