const { ethers, upgrades } = require('@nomiclabs/buidler');

async function main() {
  const ADIToken = await ethers.getContractFactory('ADIToken');
  const adiToken = await upgrades.deployProxy(ADIToken, ['Addi Token', 'ADI'], {
    unsafeAllowCustomTypes: true,
  });
  const verifier = await adiToken.deployed();

  console.log('Verifier deployed to:', verifier.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
