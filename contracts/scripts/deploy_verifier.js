async function main() {
  const Verifier = await ethers.getContractFactory('Verifier');
  const verifier = await Verifier.deploy();

  console.log('Verifier deployed to:', verifier.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
