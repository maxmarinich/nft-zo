const { ethers } = require('hardhat')

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

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
        let ZoFactory = await ethers.getContractFactory('ZoFactory');
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners()

        hardhatToken = await ZoFactory.deploy(
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
            await hardhatToken.createZombie('John', 5)

            expect(await hardhatToken.tokenURI(1)).to.equal(`${tokenURI}1`)
        })

        it('Should get contract URI', async function () {
            expect(await hardhatToken.contractURI()).to.equal(contractURI)
        })

        it('Should set new base token URI', async function () {
            expect(await hardhatToken.baseTokenURI()).to.equal(tokenURI)

            const newTokenUri = 'http://nft-zoo/'
            await hardhatToken.setBaseTokenURI(newTokenUri);

            expect(await hardhatToken.baseTokenURI()).to.equal(newTokenUri)
        })

        it('Should set new contract URI', async function () {
            expect(await hardhatToken.contractURI()).to.equal(contractURI)

            const  newContractUri = 'http://nft-zoo/contract'
            await hardhatToken.setBaseContractURI(newContractUri);

            expect(await hardhatToken.contractURI()).to.equal(newContractUri)
        })
    })

    describe('Transactions', function () {
        it('Should create new token from owner account', async function () {
            await hardhatToken.createZombie('John', 5)
            await hardhatToken.createZombie('Sam', 5)
            await hardhatToken.createZombie('Mike', 5)

            const ownerBalance = await hardhatToken.balanceOf(owner.address)

            expect(ownerBalance).to.equal(3)
            expect(await hardhatToken.totalSupply()).to.equal(3)
        })

        it('Should fail if zombie quantity reached supply limit', async function () {
            expect(await hardhatToken.totalSupplyLimit()).to.equal(5)
            expect(await hardhatToken.totalSupply()).to.equal(0)

            await hardhatToken.createZombie('John', 5)
            await hardhatToken.createZombie('Sam', 5)
            await hardhatToken.createZombie('Mike', 5)
            await hardhatToken.createZombie('Shawn', 5)
            await hardhatToken.createZombie('Adam', 5)

            expect(await hardhatToken.totalSupply()).to.equal(5)

            await  expect(hardhatToken.createZombie('Ron', 5))
                .to.be.revertedWith('VM Exception while processing transaction: revert ZoFactory: total supply limit reached.');
        })

        it('Should fail if not an owner tries to create token', async function () {
          await  expect(hardhatToken.connect(addr1).createZombie('John', 5))
              .to.be.rejectedWith('VM Exception while processing transaction: revert Ownable: caller is not the owner');
        })

        it('Should transfer tokens between accounts', async function () {
            await hardhatToken.createZombie('John', 5)
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
            await hardhatToken.createZombie('John', 5)
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
})
