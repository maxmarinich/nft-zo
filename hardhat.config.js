require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");

const { alchemyApiKey, mnemonic, etherscanApiKey } = require('./secrets.json');

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${alchemyApiKey}`,
      accounts: { mnemonic: mnemonic },
    }
  },
  etherscan: {
    apiKey: etherscanApiKey
  }
};
