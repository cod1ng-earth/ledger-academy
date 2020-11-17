const ADIToken = artifacts.require('ADIToken');

module.exports = async function () {
  const accs = await web3.eth.getAccounts();
  try {
    const adiToken = await ADIToken.deployed();

    const greet = await adiToken.greet({ from: accs[0] });
    const balance = await adiToken.balanceOf(accs[0]);
    const totalSupply = await adiToken.totalSupply();

    console.log(greet);
    console.log('balance', balance.toString());
    console.log('total supply', totalSupply.toString());
  } catch (e) {
    console.log('er', e);
  }
};
