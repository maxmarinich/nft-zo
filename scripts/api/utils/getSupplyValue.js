const fs = require('fs');
const readline = require('readline');
const { storagePathname } = require('../constants');

module.exports = async function getSupplyValue() {
  const lines = [];
  const input = fs.createReadStream(storagePathname);
  const rl = readline.createInterface({ input, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line) lines.push(line)
  }
  return lines[0];
}

