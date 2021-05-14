const fetchMetadata = require('./methods/fetchMetadata');

async function run() {
  const data = await fetchMetadata(1);

  console.log(data);
}

run()
