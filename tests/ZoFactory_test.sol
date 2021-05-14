// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "remix_tests.sol"; // this import is automatically injected by Remix.
import "../contracts/Zombies.sol";

contract Zombies {
    uint256[] tokens;
    uint256 supplyLimit = 2;
    string tokenURI = 'http://localhost/';
    string contractURI = 'http://localhost/contract';

    ZoFactory factory;

    function beforeAll () public {
        factory = new ZoFactory(tokenURI, contractURI, supplyLimit);
    }

    function checkInitialSupply () public {
        Assert.equal(factory.totalSupply(), 0, ": should be 0");
    }

    function chekTotalSupplyLimit () public {
        Assert.equal(factory.totalSupplyLimit(), supplyLimit, ": should be 0");
    }

    function checkCreateZombie() public {
        ZoFactory.Zombie memory zombie = factory.createZombie("Z-1", "R-1", "C-1", "S-1", 1);

        Assert.equal(zombie.id, 1, ": zombie ID should be 1");
        Assert.equal(factory.totalSupply(), 1, ": should be 1");
    }

    function checkGetTokenData() public {
        ZoFactory.Zombie memory zombie = factory.tokenData(1);

        Assert.equal(zombie.id, 1, ": zombie ID should be 1");
        Assert.equal(zombie.name, "Z-1", ": zombie NAME should be Z-1");
    }

    function checkTokenURI() public {
        string memory uri = factory.tokenURI(1);

        Assert.equal(uri, 'http://localhost/1', ": tokenURI should be 1");
    }

    function checkCotractURI() public {
        string memory uri = factory.contractURI();

        Assert.equal(uri, 'http://localhost/contract', ": contractURI should be 1");
    }

    function checkBaseURI() public {
        string memory uri = factory.baseTokenURI();
        Assert.equal(uri, tokenURI, ": baseTokenURI should be http://localhost/");
    }

    function checkTransfer() public {
        uint256 tokenID = 1;
        address to = address(1);

        uint256 id = factory.transferToken(to, tokenID);
        address newOwner = factory.ownerOf(tokenID);

        Assert.equal(id, tokenID, ": transfered token ID be 1");
        Assert.equal(newOwner, to, ": new owner should be new");
    }

    function checkDestroyToken() public {
        uint256 tokenID = 1;
        uint256 id = factory.destroyToken(tokenID);
        Assert.equal(id, tokenID, ": destroyed token should be 1");
    }
}
