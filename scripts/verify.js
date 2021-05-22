const { exec } = require('child_process')

const { alchemyContractAddress } = require('../secrets.json')
const { baseTokenUri, baseContractUri, totalSupplyLimit } = require('../base.config')

const constructorArguments = `${baseTokenUri} ${baseContractUri} ${totalSupplyLimit}`
const command = `npx hardhat verify --network rinkeby ${alchemyContractAddress} ${constructorArguments}`

exec(command, (err, stdout, stderr) => {
    if (err) {
        throw new Error(err)
    } else {
        console.log(`stdout: ${stdout}`)
        console.error(`stderr: ${stderr}`)
    }
})
