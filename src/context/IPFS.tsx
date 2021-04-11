import { create as createIpfs, IPFS } from 'ipfs-core';
import IPFSClient from 'ipfs-message-port-client';
import React, { useEffect, useState, useContext } from "react";


interface IIpfsContext {
  ipfsClient: IPFSClient | undefined,
  ipfsNode: IPFS,
}

const IpfsContext = React.createContext<IIpfsContext>({
  ipfsNode: {} as IPFS,
  ipfsClient: {} as IPFSClient,
});

const useIPFS = () => useContext(IpfsContext);

const IPFSProvider = ({ children }: {
  children: React.ReactNode
}) => {

  const [ipfsNode, setIpfsNode] = useState<IPFS>();
  const [ipfsClient, setIpfsClient] = useState<IPFSClient>();

  useEffect(() => {
    if (window.SharedWorker) {
      const worker = new SharedWorker('/ipfsWorker/main.js', { type: 'module', name: 'ipfs-worker' });
      setIpfsClient(IPFSClient.from(worker.port));
    }
  }, [])
  
  useEffect(() => {
    (async () => {
      const _ipfsNode: IPFS = await createIpfs({
        repo: 'ipfs-node',
        config: {
          Discovery: {
            MDNS: {
              Enabled: false,
            },
            webRTCStar: {
              Enabled: true,
            },
          },
          Addresses: {
            Swarm: [
              '/dns4/ipfs.depa.digital/tcp/9091/wss/p2p-webrtc-star'
              //'/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
            ],
          },
        },
      });
      // _ipfsNode.swarm.connect('/ip4/167.71.52.88/tcp/4002/wss/p2p/QmXAghnP7DqmAEE7Zx4SxMo3UcUVSn8f1xDCT6x1ysYMSj');
      // _ipfsNode.libp2p.transportManager.listen(multiaddr('/dns4/ipfs.depa.digital/tcp/9091/wss/p2p-webrtc-star/')).catch(console.warn);

      const _ipfsId = await _ipfsNode.id();
      console.log('ipfs node (v%s) is running [id: %s]', _ipfsId.agentVersion, _ipfsId.id);
      setIpfsNode(_ipfsNode);
    })();
  }, []);


  return (
    <IpfsContext.Provider value={{
      ipfsNode: ipfsNode || {} as IPFS,
      ipfsClient
    }}>
      {ipfsNode ? children : <div>starting ipfs</div>}
    </IpfsContext.Provider>
  );
};

export { IPFSProvider, useIPFS };
