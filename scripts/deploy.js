const { baseTokenUri, baseContractUri, totalSupplyLimit } = require('../base.config');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying contract with the account: ${deployer.address}.`);
  console.log(`Account balance: ${(await deployer.getBalance()).toString()}.`);

  const contractFactory = await ethers.getContractFactory('ZoFactory');
  const contract = await contractFactory.deploy(baseTokenUri, baseContractUri, totalSupplyLimit);

  await contract.deployed();
  console.log('Deployed to:', contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
