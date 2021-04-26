require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-web3");

const { alchemyApiKey, infuraProjectId, mnemonic } = require('./secrets.json');

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${alchemyApiKey}`,
      accounts: { mnemonic: mnemonic },
    },
    rinkebyInfura: {
      url: `https://rinkeby.infura.io/v3/${infuraProjectId}`,
      accounts: { mnemonic: mnemonic },
    },
  },
};
