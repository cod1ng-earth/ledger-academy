require('dotenv-flow').config({
  path: '..',
});
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
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://ropsten.infura.io/v3/${process.env.PROJECT_ID}`),
      networkId: 3, // Ropsten's id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://rinkeby.infura.io/v3/${process.env.PROJECT_ID}`),
      networkId: 4, // Rinkeby's id
    },
    kovan: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://kovan.infura.io/v3/${process.env.PROJECT_ID}`),
      networkId: 42, // Kovan's id
    },
    goerli: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://goerli.infura.io/v3/${process.env.PROJECT_ID}`),
      networkId: 5, // Goerli's id
      gas: 7500000,
    },
  },
};
