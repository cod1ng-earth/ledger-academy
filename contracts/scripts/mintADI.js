const { default: Web3 } = require('web3');

const ADIToken = artifacts.require('ADIToken');

module.exports = async function (callback) {
  const accounts = await web3.eth.getAccounts();
  try {
    const adiToken = await ADIToken.deployed();

    const amount = web3.utils.numberToHex(1e19);
    const minted = await adiToken.mint(accounts[0], amount);
    const totalSupply = await adiToken.totalSupply();

    console.log('total supply', totalSupply.toString());
  } catch (e) {
    console.log('er', e);
  }
  callback(true);
};
