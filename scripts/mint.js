const { alchemyContractAddress } = require('../secrets.json');

async function main() {
  const Zo = await ethers.getContractFactory("ZoFactory")
  const zo = await Zo.attach(alchemyContractAddress)

  await zo.setBaseURI('https://raw.githubusercontent.com/maxmarinich/nft-zo/gh-pages/zo/');

  const value = await zo.baseTokenURI();
  const id = await zo.createZombie();


  console.log('Zo URI', value);
  console.log('Zo ID', id);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
