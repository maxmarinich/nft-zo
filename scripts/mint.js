const { alchemyContractAddress } = require('../secrets.json');

async function main() {
  const NZO = await ethers.getContractFactory("ZoFactory")
  const nzo = await NZO.attach(alchemyContractAddress)

  await nzo.setBaseURI('https://maxmarinich.github.io/nft-zo/zo/');

  const value = await nzo.baseTokenURI();
  const id = await nzo.createZombie();

  console.log('NZO URI:', value);
  console.log('NZO ID:', id);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
