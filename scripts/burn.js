const { alchemyContractAddress } = require('../secrets.json');

async function main() {
  const tokenID = 2;
  const contractFactory = await ethers.getContractFactory('ZoFactory');
  const contract = await contractFactory.attach(alchemyContractAddress);

  const destroyedToken = await contract.destroyToken(tokenID);
  console.log('NZO destroyedToken:', destroyedToken);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
