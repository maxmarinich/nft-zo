const fs = require('fs');
const readline = require('readline');
const { storagePathname } = require('../constants');

module.exports = async function getTokenSupplyValue() {
  const lines = [];
  const input = fs.createReadStream(storagePathname);
  const rl = readline.createInterface({ input, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line) lines.push(line)
  }

  return Number(lines[0]) || 0;
}

