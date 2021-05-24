const { ethers } = require('hardhat')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

const errorPrefix = 'VM Exception while processing transaction: revert '
const errorTransfer = `${errorPrefix}ERC721: transfer of token that is not own`
const errorOwnable = `${errorPrefix}Ownable: caller is not the owner`
const errorSupply = `${errorPrefix}Total supply limit reached`
const errorBurnFee = `${errorPrefix}Burn\`s fee not allowed`
const errorBurnOwner = `${errorPrefix}Burn of token that is not own`

describe('Token contract', function () {
    let provider = ethers.getDefaultProvider()
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

        hardhatToken = await Contract.deploy(tokenURI, contractURI, totalSupplyLimit)
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
            expect(await hardhatToken.totalSupplyLimit()).to.equal(totalSupplyLimit)
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
        describe('Create', function () {
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

                await expect(hardhatToken.createToken('Ron', 5)).to.be.revertedWith(errorSupply)
            })

            it('Should fail if not an owner tries to create token', async function () {
                await expect(hardhatToken.connect(addr1).createToken('John', 5)).to.be.rejectedWith(errorOwnable)
            })
        })

        describe('Transfer', function () {
            it('Should transfer tokens between accounts', async function () {
                await hardhatToken.createToken('John', 5)
                const initialAddr1Balance = await hardhatToken.balanceOf(addr1.address)
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

                await expect(hardhatToken.transferToken(owner.address, 1)).to.be.revertedWith(errorTransfer)
            })
        })

        describe('Withdraw', function () {
            it('Should withdraw half balance from contract', async function () {
                const burnFee = ethers.utils.parseEther('1.0')
                await hardhatToken.createToken('John', 1)
                await hardhatToken.burnToken(1, { value: burnFee })
                expect(await hardhatToken.contractBalance()).to.equal(burnFee)

                const halfBalance = ethers.utils.parseEther('0.5')
                await hardhatToken.withdraw(halfBalance)
                expect(await hardhatToken.contractBalance()).to.equal(halfBalance)
            })

            it('Should withdraw all balance from contract', async function () {
                const burnFee = ethers.utils.parseEther('1.0')
                await hardhatToken.createToken('John', 1)
                await hardhatToken.burnToken(1, { value: burnFee })
                expect(await hardhatToken.contractBalance()).to.equal(burnFee)

                await hardhatToken.withdraw(ethers.utils.parseEther('1.5'))
                expect(await hardhatToken.contractBalance()).to.equal(0)
            })

            it('Should throw error if not owner calls method', async function () {
                await expect(hardhatToken.connect(addr1).withdraw(0)).to.be.revertedWith(errorOwnable)
            })
        })

        describe('Burn', function () {
            it('Should burn token', async function () {
                const burnFee = ethers.utils.parseEther('1.0')
                await hardhatToken.createToken('John', 1)
                expect(await hardhatToken.ownerOf(1)).to.equal(owner.address)
                await hardhatToken.burnToken(1, { value: burnFee })
                expect(await hardhatToken.contractBalance()).to.equal(burnFee)
            })

            it('Should throw error if value is not enough for burning', async function () {
                const burnFee = ethers.utils.parseEther('0.5')
                await hardhatToken.createToken('John', 1)
                expect(await hardhatToken.ownerOf(1)).to.equal(owner.address)

                await expect(hardhatToken.burnToken(1, { value: burnFee })).to.be.revertedWith(errorBurnFee)
            })

            it('Should throw error if no value was passed ', async function () {
                await hardhatToken.createToken('John', 1)
                expect(await hardhatToken.ownerOf(1)).to.equal(owner.address)

                await expect(hardhatToken.burnToken(1)).to.be.revertedWith(errorBurnFee)
            })

            it('Should throw error if not owner calls method', async function () {
                const burnFee = ethers.utils.parseEther('1.0')
                await hardhatToken.createToken('John', 1)
                expect(await hardhatToken.ownerOf(1)).to.equal(owner.address)
                await hardhatToken.transferToken(addr2.address, 1)
                expect(await hardhatToken.ownerOf(1)).to.equal(addr2.address)

                await expect(hardhatToken.burnToken(1, { value: burnFee })).to.be.revertedWith(errorBurnOwner)
                await expect(hardhatToken.connect(addr1).burnToken(1, { value: burnFee })).to.be.revertedWith(
                    errorBurnOwner
                )
            })
        })
    })
})
