async function main() {
  const NZO = await ethers.getContractFactory('ZoFactory');
  const nzo = await NZO.deploy();

  await nzo.deployed();
  console.log('NZO deployed to:', nzo.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
