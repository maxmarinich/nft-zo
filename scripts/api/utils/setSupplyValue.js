const fs = require('fs');
const { storagePathname } = require('../constants');

module.exports = function setSupplyValue(value = '') {
  fs.writeFileSync(storagePathname, String(value));
};
