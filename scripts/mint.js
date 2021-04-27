const { alchemyContractAddress } = require('../secrets.json');

async function main() {
  const NZO = await ethers.getContractFactory("ZoFactory")
  const nzo = await NZO.attach(alchemyContractAddress)

  const baseURI = await nzo.baseTokenURI();
  const contractURI = await nzo.contractURI();
  const id = await nzo.createZombie();

  console.log('NZO baseURI:', baseURI);
  console.log('NZO contractURI:', contractURI);
  console.log('NZO zombieID:', id);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
