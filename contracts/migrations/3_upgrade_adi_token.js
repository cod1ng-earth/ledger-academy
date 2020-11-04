const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const ADIToken = artifacts.require('ADIToken');

module.exports = async function (deployer) {
  const existing = await ADIToken.deployed();
  const instance = await upgradeProxy(existing.address, ADIToken, {
    deployer,
    unsafeAllowCustomTypes: true, // still needed for OZ's ERC20 ERC20PresetMinterPauserUpgradeSafe
  });
  console.log('Upgraded', instance.address);
};
