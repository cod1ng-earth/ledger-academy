import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export const injected = new InjectedConnector({
  supportedChainIds: [5, 17, 42, 5779, 6874585],
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 5: `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}` },
});
