const Web3 = require('web3');
const { networks } = require('../hardhat.config');

task("accounts", "Prints accounts", async (_, { web3 }) => {
  const provider = await web3.providers.HttpProvider(networks.rinkeby.url);
  const contract = new Web3(provider);

  console.log(contract);
});
