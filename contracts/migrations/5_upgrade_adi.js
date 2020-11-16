const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const ADIToken = artifacts.require('ADIToken');

module.exports = async function (deployer) {
  const adiToken = await ADIToken.deployed();
  const instance = await upgradeProxy(adiToken.address, ADIToken, {
    deployer,
    unsafeAllowCustomTypes: true, // needed because of AccessControl::RoleData being a struct
  });
  console.log('Upgraded', instance.address);
};
