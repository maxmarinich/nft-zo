const fetchMetadata = require('./methods/fetchMetadata');
const setSupplyValue = require('./utils/setSupplyValue');

async function run() {
  const data = await fetchMetadata();

  console.log(data);
}

run()
