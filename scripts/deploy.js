// require("@nomiclabs/hardhat-waffle");
// 0x8b20F139cBbcceCB9cd40578ceB4C62217d62525 - infura
// 0x3dFF3284007BF50e025bc7aeC170b4E832dC70de - alchemy

async function main() {
  // We get the contract to deploy
  const Zos = await ethers.getContractFactory('ZoFactory');
  console.log('Deploying Zos...');
  const zos = await Zos.deploy();
  await zos.deployed();
  console.log('Zos deployed to:', zos.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
