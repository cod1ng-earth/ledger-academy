const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const Verifier = artifacts.require('Verifier');
module.exports = async function (deployer) {
  const instance = await deployProxy(Verifier, [], {
    deployer,
  });
  console.log('Deployed', instance.address);
};
