const fs = require('fs');
const { storagePathname } = require('../constants');

module.exports = function setTokenSupplyValue(value = '') {
  fs.writeFileSync(storagePathname, String(value));
};
