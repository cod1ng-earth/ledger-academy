const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const ADIToken = artifacts.require('ADIToken');
module.exports = async function (deployer) {
  const instance = await deployProxy(ADIToken, ['Addi Token', 'ADI'], {
    deployer,
    unsafeAllowCustomTypes: true, // still needed for OZ's ERC20 ERC20PresetMinterPauserUpgradeSafe
  });
  console.log('Deployed', instance.address);
};
