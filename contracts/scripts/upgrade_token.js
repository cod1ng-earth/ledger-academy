const { ethers, upgrades } = require('@nomiclabs/buidler');

async function main() {
  const ADIToken = await ethers.getContractFactory('ADIToken');
  const adiToken = await upgrades.upgradeProxy('0x95d16658e4092759aea024d30F709E49840448Ec', ADIToken);

  console.log('Token upgraded to:', adiToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
