const { localOwnerAddress } = require('../secrets.json');

async function main() {
  const tokenId = 1;
  const newOwner = '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f';

  const contractFactory = await ethers.getContractFactory('ZoFactory');
  const contract = await contractFactory.attach(alchemyContractAddress);

  const data = await contract.transferFrom(localOwnerAddress, newOwner, tokenId);
  console.log('NZO transfer success:', data);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
