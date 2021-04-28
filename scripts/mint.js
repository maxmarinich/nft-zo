const { alchemyContractAddress } = require('../secrets.json');

async function main() {
  const contractFactory = await ethers.getContractFactory('ZoFactory');
  const contract = await contractFactory.attach(alchemyContractAddress);

  const baseURI = await contract.baseTokenURI();
  const contractURI = await contract.contractURI();
  const zombie = await contract.createZombie();

  console.log('NZO baseURI:', baseURI);
  console.log('NZO contractURI:', contractURI);
  console.log('NZO zombie:', zombie);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
