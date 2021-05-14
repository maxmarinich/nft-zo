const { localContractAddress } = require('../../secrets.json');
const fetchMetadata = require('../api/methods/fetchMetadata');

async function main() {
  const contractFactory = await ethers.getContractFactory('ZoFactory');
  const contract = await contractFactory.attach(localContractAddress);

  const totalSupply = (await contract.totalSupply()).toNumber();
  const { id, name, burning_fee = 0 } = await fetchMetadata(totalSupply + 1);

  await contract.createZombie(name, burning_fee);
  console.log(`Create token -> id: ${id}, name: ${name}, burning fee: ${burning_fee}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
