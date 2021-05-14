const fetchMetadata = require('../scripts/api/methods/fetchMetadata');
const { alchemyContractAddress } = require('../secrets.json');

async function main() {
  const burningFee = 0;
  const { name } = await fetchMetadata();
  const contractFactory = await ethers.getContractFactory('ZoFactory');
  const contract = await contractFactory.attach(alchemyContractAddress);

  const tokenID = await contract.createZombie(...metadata);

  console.log('NZO destroyed:', tokenID);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
