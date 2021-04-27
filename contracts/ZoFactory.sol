// contracts/MyContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ZoFactory is Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string zoBaseTokenURI;
    string zoBaseContractURI;

    mapping (uint => address) public zombieToOwner;
    mapping (address => uint) ownerZombieCount;

    constructor(string memory _tokenURI, string memory _contractURI) ERC721("NFTZo", "NZO") {
        console.log("Deploying the NFTZo...", _tokenURI, _contractURI);

        zoBaseTokenURI = _tokenURI;
        zoBaseContractURI = _contractURI;
    }

    function createZombie() public onlyOwner returns (uint) {
        _tokenIds.increment();

        uint newItemId = _tokenIds.current();

        _mint(owner(), newItemId);
        _setTokenURI(newItemId, zoBaseTokenURI);

        return newItemId;
    }

    function transferOwnership(address from, address to, uint256 tokenId) public {
        _transfer(from, to, tokenId);
    }

    function setBaseURI(string memory _tokenURI) public onlyOwner {
        zoBaseTokenURI = _tokenURI;
    }

    function setContractURI(string memory _contractURI) public onlyOwner {
        zoBaseContractURI = _contractURI;
    }

    function baseTokenURI() public view returns (string memory) {
        return zoBaseTokenURI;
    }

    function contractURI() public view returns (string memory) {
        return zoBaseContractURI;
    }
}
