import React, { useContext, useEffect, useState } from 'react';

import IPFSClient from "ipfs-message-port-client";

const IpfsContext = React.createContext<IPFSClient | null>(null);

const useIPFS = () => useContext(IpfsContext);

const IPFSProvider = ({ children }: any) => {
  const [ipfsClient, setIpfsClient] = useState<IPFSClient | null>(null);

  useEffect(() => {
    const worker = new SharedWorker('/ipfsWorker.js', { type: 'module' })
    const client = IPFSClient.from(worker.port)
    setIpfsClient(client);
  }, []);

  return (
    <IpfsContext.Provider value={ipfsClient}>
      {children}
    </IpfsContext.Provider>
  );
};

export { IPFSProvider, useIPFS };
