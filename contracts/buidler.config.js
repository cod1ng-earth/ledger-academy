/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv-flow').config({
  path: '..',
});

usePlugin('@nomiclabs/buidler-ethers');
usePlugin('@openzeppelin/buidler-upgrades');

const mnemonic = process.env.MNEMONIC;
const projectId = process.env.PROJECT_ID;

module.exports = {
  defaultNetwork: 'development',
  networks: {
    development: {

      url: 'http://127.0.0.1:7545',
      // chainId: 5779,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${projectId}`,
      chainId: 5,
      accounts: {
        mnemonic,
      },
    },
    txbchain: {
      url: 'https://txbchain.depa.digital:8545',
      chainId: 6874585, // Tino's id
      gas: 'auto',
      accounts: {
        mnemonic,
      },
    },
  },
  solc: {
    version: '0.6.7',
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};
