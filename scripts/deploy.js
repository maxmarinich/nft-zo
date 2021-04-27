async function main() {
  const tokenUri = 'https://maxmarinich.github.io/nft-zo/zo/';
  const contractUri = 'https://maxmarinich.github.io/nft-zo/contract';
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying contract with the account: ${deployer.address}.`);
  console.log(`Account balance: ${(await deployer.getBalance()).toString()}.`);

  const NZO = await ethers.getContractFactory('ZoFactory');
  const nzo = await NZO.deploy(tokenUri, contractUri);

  await nzo.deployed();
  console.log('NZO deployed to:', nzo.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
