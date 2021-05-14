const fetch = require('node-fetch');
const { baseTokenUri } = require('../../../base.config');

module.exports = async function fetchMetadata(id) {
  return fetch(`${baseTokenUri}${id}`)
    .then((res) => (res.ok ? res.json() : {}))
    .then((data) => (data ? { id, ...data } : {}));
};
