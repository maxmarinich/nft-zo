const { ethers } = require('hardhat')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

describe('Token contract', function () {
    let totalSupplyLimit = 5
    let tokenURI = 'http://localhost/'
    let contractURI = 'http://localhost/contract'
    let hardhatToken
    let owner
    let addr1
    let addr2
    let addrs

    beforeEach(async function () {
        let Contract = await ethers.getContractFactory('Contract')
        ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()

        hardhatToken = await Contract.deploy(
            tokenURI,
            contractURI,
            totalSupplyLimit
        )
    })

    describe('Deployment', function () {
        it('Should set the right owner', async function () {
            expect(await hardhatToken.owner()).to.equal(owner.address)
        })

        it('Should set base token URI', async function () {
            expect(await hardhatToken.baseTokenURI()).to.equal(tokenURI)
        })

        it('Should set contract URI', async function () {
            expect(await hardhatToken.contractURI()).to.equal(contractURI)
        })

        it('Should set total supply limit', async function () {
            expect(await hardhatToken.totalSupplyLimit()).to.equal(
                totalSupplyLimit
            )
        })

        it('Should assign the total supply of tokens to the owner', async function () {
            const ownerBalance = await hardhatToken.balanceOf(owner.address)
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance)
        })
    })

    describe('Base operations', function () {
        it('Should get base token URI', async function () {
            expect(await hardhatToken.baseTokenURI()).to.equal(tokenURI)
        })

        it('Should get token URI', async function () {
            await hardhatToken.createToken('John', 5)

            console.log('__TL:', await hardhatToken.tokenURI(1))

            expect(await hardhatToken.tokenURI(1)).to.equal(`${tokenURI}1`)
        })

        it('Should get contract URI', async function () {
            expect(await hardhatToken.contractURI()).to.equal(contractURI)
        })

        it('Should set new base token URI', async function () {
            expect(await hardhatToken.baseTokenURI()).to.equal(tokenURI)

            const newTokenUri = 'http://nft-zoo/'
            await hardhatToken.setBaseTokenURI(newTokenUri)

            expect(await hardhatToken.baseTokenURI()).to.equal(newTokenUri)
        })

        it('Should set new contract URI', async function () {
            expect(await hardhatToken.contractURI()).to.equal(contractURI)

            const newContractUri = 'http://nft-zoo/contract'
            await hardhatToken.setBaseContractURI(newContractUri)

            expect(await hardhatToken.contractURI()).to.equal(newContractUri)
        })
    })

    describe('Transactions', function () {
        it('Should create new token from owner account', async function () {
            await hardhatToken.createToken('John', 5)
            await hardhatToken.createToken('Sam', 5)
            await hardhatToken.createToken('Mike', 5)

            const ownerBalance = await hardhatToken.balanceOf(owner.address)

            expect(ownerBalance).to.equal(3)
            expect(await hardhatToken.totalSupply()).to.equal(3)
        })

        it('Should fail if zombie quantity reached supply limit', async function () {
            expect(await hardhatToken.totalSupplyLimit()).to.equal(5)
            expect(await hardhatToken.totalSupply()).to.equal(0)

            await hardhatToken.createToken('John', 5)
            await hardhatToken.createToken('Sam', 5)
            await hardhatToken.createToken('Mike', 5)
            await hardhatToken.createToken('Shawn', 5)
            await hardhatToken.createToken('Adam', 5)

            expect(await hardhatToken.totalSupply()).to.equal(5)

            await expect(hardhatToken.createToken('Ron', 5)).to.be.revertedWith(
                'VM Exception while processing transaction: revert Total supply limit reached'
            )
        })

        it('Should fail if not an owner tries to create token', async function () {
            await expect(
                hardhatToken.connect(addr1).createToken('John', 5)
            ).to.be.rejectedWith(
                'VM Exception while processing transaction: revert Ownable: caller is not the owner'
            )
        })

        it('Should transfer tokens between accounts', async function () {
            await hardhatToken.createToken('John', 5)
            const initialAddr1Balance = await hardhatToken.balanceOf(
                addr1.address
            )
            expect(initialAddr1Balance).to.equal(0)

            await hardhatToken.transferToken(addr1.address, 1)

            const newOwnerBalance = await hardhatToken.balanceOf(owner.address)
            const newAddr1Balance = await hardhatToken.balanceOf(addr1.address)
            expect(newOwnerBalance).to.equal(0)
            expect(newAddr1Balance).to.equal(1)
        })

        it('Should fail if not an owner tries to transfer token', async function () {
            await hardhatToken.createToken('John', 5)
            await hardhatToken.transferToken(addr1.address, 1)

            const ownerBalance = await hardhatToken.balanceOf(owner.address)
            expect(ownerBalance).to.equal(0)

            await expect(
                hardhatToken.transferToken(owner.address, 1)
            ).to.be.revertedWith(
                'VM Exception while processing transaction: revert ERC721: transfer of token that is not own'
            )
        })
    })

    describe('Burn', function () {
        // To convert Ether to Wei:
        const value = ethers.utils.parseEther('1.0') // ether in this case MUST be a string
        // Or you can use Wei directly if you have that:
        // value: someBigNumber
        // value: 1234   // Note that using JavaScript numbers requires they are less than Number.MAX_SAFE_INTEGER
        // value: "1234567890"
        // value: "0x1234"

        // Or, promises are also supported:
        // value: provider.getBalance(addr)

        it('Should burn token', async function () {
            await hardhatToken.createToken('John', 1)
            expect(await hardhatToken.ownerOf(1)).to.equal(owner.address)
            await hardhatToken.burnToken(1, { value })
            expect(await hardhatToken.contractBalance()).to.equal(value)
        })

        it('Should throw error if not value', async function () {
            await hardhatToken.createToken('John', 1)
            expect(await hardhatToken.ownerOf(1)).to.equal(owner.address)
            await expect(hardhatToken.burnToken(1)).to.be.revertedWith(
                'VM Exception while processing transaction: revert Burn`s fee not allowed'
            )
        })

        it('Should throw error if not owner', async function () {
            await hardhatToken.createToken('John', 1)
            expect(await hardhatToken.ownerOf(1)).to.equal(owner.address)
            await hardhatToken.transferToken(addr2.address, 1)

            await expect(hardhatToken.burnToken(1, { value })).to.be.revertedWith(
                'VM Exception while processing transaction: revert Burn`s fee not allowed'
            )
        })
    })

    describe('Withdraw', function () {
        it('Should withdraw all balance to contract owner ', async function () {
            expect(await hardhatToken.contractBalance()).to.equal(1)
        })

        it('Should throw error if not owner call method', async function () {
            expect(await hardhatToken.contractBalance()).to.equal(1)
        })
    })
})
