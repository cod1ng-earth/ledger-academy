import { create as createIpfs, Ipfs } from 'ipfs';
import IPFSClient from 'ipfs-message-port-client';
import React, { useContext, useEffect, useState } from 'react';

interface IIpfsContext {
  ipfsClient?: IPFSClient | null;
  ipfsNode?: Ipfs;
  addSwarmAddress?: (address: string) => any;
  swarmAddresses: string[];
}

const IpfsContext = React.createContext<IIpfsContext>({ swarmAddresses: [] });

const useIPFS = () => useContext(IpfsContext);

const IPFSProvider = ({ children }: any) => {
  const [ipfsClient, setIpfsClient] = useState<IPFSClient>();
  const [ipfsNode, setIpfsNode] = useState<Ipfs>();
  const [swarmAddresses, setSwarmAddresses] = useState<string[]>([]);

  // this is supposed to work but doesn't (dynamically add swarm addresses)
  // ipfs 0.47, see https://jira.votum.info:7443/browse/DECNT-38):
  // const res = ipfsNode!.libp2p.transportManager.listen(multiAddr);

  const addSwarmAddress = async (addr: string): Promise<void> => {
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
      if (ipfsNode) {
        await ipfsNode.stop();
      }
      const _ipfsNode = await createIpfs({
        repo: 'ipfs-node',
        config: {
          Addresses: {
            Swarm: swarmAddresses,
          },
        },
      });
      const _ipfsId = await _ipfsNode.id();
      console.log('ipfs node (v%s) is running [id: %s]', _ipfsId.agentVersion, _ipfsId.id);
      setIpfsNode(_ipfsNode);
    })();
  }, [swarmAddresses]);

  return (
    <IpfsContext.Provider value={{
      ipfsClient, ipfsNode, addSwarmAddress, swarmAddresses,
    }}>
      {children}
    </IpfsContext.Provider>
  );
};

export { IPFSProvider, useIPFS };
