import React, { useContext, useEffect, useState } from 'react';

import {Ipfs, create as createNode} from "ipfs";

const IpfsContext = React.createContext<Ipfs | null>(null);

const useIPFS = () => useContext(IpfsContext);

const IPFSProvider = ({ children }: any) => {
  const [ipfsNode, setIpfsNode] = useState<Ipfs | null>(null);

  useEffect(() => {
    (async () => {
      const _ipfsNode = await createNode({
        config: {
          Addresses: {
            Swarm: ['/dns4/ipfs.depa.digital/tcp/9091/wss/p2p-webrtc-star'],
          },
        },
      });
      const _ipfsId = await _ipfsNode.id();
      console.dir(_ipfsId);
      console.log('ipfs node (v%s) is running [id: %s]', _ipfsId.agentVersion, _ipfsId.id);
      setIpfsNode(_ipfsNode);
    })();
  }, []);

  return (
    <IpfsContext.Provider value={ipfsNode}>
      {children}
    </IpfsContext.Provider>
  );
};

export { IPFSProvider, useIPFS };
