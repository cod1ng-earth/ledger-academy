import Arweave from 'arweave';
import { ArweaveAccount } from "modules/arweave";
import React, { useContext, useState } from "react";


interface ArweaveContext {
  arweave: Arweave,
  account?: ArweaveAccount,
  setAccount: (account: ArweaveAccount) => void
}

const arweave = Arweave.init({
  host: 'arweave.net', // Hostname or IP address for a Arweave host
  port: 443, // Port
  protocol: 'https', // Network protocol http or https
  timeout: 20000, // Network request timeouts in milliseconds
  logging: false, // Enable network request logging
});

const ArweaveContext = React.createContext<ArweaveContext>({
  arweave,
  setAccount: () => {}
});

const useArweave = () => useContext(ArweaveContext);

const ArweaveProvider = ({ children }: {
  children: React.ReactNode
}) => {
  const [account, setAccount] = useState<ArweaveAccount>();

  return (
    <ArweaveContext.Provider value={{
      arweave,
      account,
      setAccount
    }}>
      {children}
    </ArweaveContext.Provider>
  );
}

export { ArweaveProvider, useArweave };
