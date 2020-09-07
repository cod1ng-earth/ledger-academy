import React, { useContext, useEffect, useState } from 'react';
import { IPFS, create as ipfsCreate } from 'ipfs';

const IpfsContext = React.createContext<IPFS | null>(null);

const useIPFS = () => useContext(IpfsContext);

const IPFSProvider = ({ children }: any) => {
  const [ipfsNode, setIpfsNode] = useState<IPFS | null>(null);

  useEffect(() => {
    (async () => {
      const _ipfsNode = await ipfsCreate();
      const _ipfsId = await _ipfsNode.id();
      console.log('ipfs node is running %s', _ipfsId.id);
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
