const { alchemyContractAddress } = require('../secrets.json');

async function main() {
  const contractFactory = await ethers.getContractFactory('ZoFactory');
  const contract = await contractFactory.attach(alchemyContractAddress);
  const tokenID = (await contract.totalSupply()).toNumber();

  const destroyedToken = await contract.destroyToken(tokenID);
  console.log('NZO destroyedToken:', destroyedToken);
  console.log('NZO destroyedToken: 1', destroyedToken.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
