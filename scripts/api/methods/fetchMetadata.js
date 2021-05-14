const fetch = require('node-fetch');
const getSupplyValue = require('../utils/getSupplyValue');
const { baseTokenUri } = require('../../../base.config');

module.exports = async function f(tokenId) {
  const value = tokenId || await getSupplyValue() || 1;
  const url = `${baseTokenUri}${value}`;

  return fetch(url).then(res => res.ok ? res.json() : {});
}
