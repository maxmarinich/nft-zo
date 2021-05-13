const { localContractAddress } = require('../../secrets.json');

async function main() {
  const contractFactory = await ethers.getContractFactory('ZoFactory');
  const contract = await contractFactory.attach(localContractAddress);

  const baseURI = await contract.baseTokenURI();
  const contractURI = await contract.contractURI();
  const zombie = await contract.createZombie('ZOO', 'Rank 1', 'Cat 1', 'SubCat 1', '01-12-2020');
  // const zombie = await contract.createZombie('ZOO 2', 'Rank 2', 'Cat 2', 'SubCat 2', '01-12-2022');
  //const zombie = await contract.createZombie('ZOO 3', 'Rank 3', 'Cat 3', 'SubCat 3', '01-12-2023');

  console.log('NZO baseURI:', baseURI);
  console.log('NZO contractURI:', contractURI);
  console.log('NZO zombieID:', zombie);

  const totalSupply = await contract.totalSupply();
  const totalSupplyLimit = await contract.totalSupplyLimit();
  const zombies = await contract.getTokenData(1);
  console.log('NZO totalSupply:', totalSupply);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
