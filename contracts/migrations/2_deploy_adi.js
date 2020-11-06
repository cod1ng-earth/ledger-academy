const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const ADIToken = artifacts.require('ADIToken');

module.exports = async function (deployer) {
  const instance = await deployProxy(ADIToken, ['Addi Token', 'ADI'], {
    deployer,
    unsafeAllowCustomTypes: true, // needed because of AccessControl::RoleData being a struct
  });
  console.log('Deployed', instance.address);
};
