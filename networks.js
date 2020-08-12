const { projectId, mnemonic } = require('./.secrets.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      protocol: 'http',
      host: '127.0.0.1',
      port: 7545,
      gas: 5000000,
      gasPrice: 5e9,
      networkId: '*',
    },
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/" + projectId),
      networkId: 3,       // Ropsten's id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/" + projectId),
      networkId: 4,       // Rinkeby's id
    },
    kovan: {
      provider: () => new HDWalletProvider(mnemonic, "https://kovan.infura.io/v3/" + projectId),
      networkId: 42,       // Kovan's id
    },
    goerli: {
      provider: () => new HDWalletProvider(mnemonic, "https://goerli.infura.io/v3/" + projectId),
      networkId: 5,     // Goerli's id
      gas: 7500000,
    },
  },
};
