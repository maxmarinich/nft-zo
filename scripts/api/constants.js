const path = require('path');

const storageFilename = '.supply_storage';
const storagePathname = path.join(__dirname, storageFilename);

module.exports = {
  storageFilename,
  storagePathname,
};
