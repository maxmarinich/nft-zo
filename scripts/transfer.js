const { alchemyContractAddress } = require('../secrets.json');

async function main() {
  const newOwner = '0xA696906271b10DA4D6ABf13828Ee787d597b2566';
  const contractFactory = await ethers.getContractFactory('ZoFactory');
  const contract = await contractFactory.attach(alchemyContractAddress);

  const tokenID = await contract.transferToken(newOwner, 1);
  console.log('NZO transfer success:', tokenID);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
