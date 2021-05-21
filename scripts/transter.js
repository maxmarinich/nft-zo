const { alchemyContractAddress, newOwnerAddress } = require('../secrets.json');

async function main() {
    const contractFactory = await ethers.getContractFactory('ZoFactory');
    const contract = await contractFactory.attach(alchemyContractAddress);

    const tokenId = (await contract.totalSupply()).toNumber();
    const token = await contract.transferToken(newOwnerAddress, tokenId);
    console.log('Transfer success --> tokenId:', tokenId, ' transaction: ', token);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
