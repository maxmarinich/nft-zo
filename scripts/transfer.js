const { alchemyContractAddress } = require('../secrets.json');

async function main() {
  const owner = '0x6894af909Ed0b6F271Fd7231Fa7Cd906529dF49E';
  const newOwner = '0xa190a41edA88931A92468065903C8FA908611892';
  const tokenId = 2;

  const NZO = await ethers.getContractFactory("ZoFactory");
  const nzo = await NZO.attach(alchemyContractAddress)

  const data = await nzo.transferFrom(owner, newOwner, tokenId);
  console.log('NZO transfer success:', data);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
