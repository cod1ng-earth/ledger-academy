import React, { useContext, useEffect, useState } from 'react';

import {Ipfs, create as createIpfs} from "ipfs";

import IPFSClient from "ipfs-message-port-client";

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
    const worker = new SharedWorker('/ipfsWorker.js', { type: 'module' })
    const client = IPFSClient.from(worker.port)
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
      const _ipfsId = await _ipfsNode.id();
      console.log('ipfs node (v%s) is running [id: %s]', _ipfsId.agentVersion, _ipfsId.id);
      setIpfsNode(_ipfsNode);
    })();
  }, []);

  return (
    <IpfsContext.Provider value={{ipfsClient, ipfsNode}}>
      {children}
    </IpfsContext.Provider>
  );
};

export { IPFSProvider, useIPFS };
