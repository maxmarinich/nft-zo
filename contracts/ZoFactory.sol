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

    string private tokenURI;
    string private contractURI;

    mapping (uint => address) public zombieToOwner;
    mapping (address => uint) ownerZombieCount;

    constructor() ERC721("NFTZo", "NZO") {
        console.log("Deploying the NFTZo...");
    }

    function createZombie() public onlyOwner returns (uint) {
        _tokenIds.increment();

        uint newItemId = _tokenIds.current();

        _mint(_owner, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function setBaseURI(string memory _tokenURI) {
        tokenURI = _tokenURI;
    }

    function setContractURI(string memory _contractURI) {
        contractURI = _contractURI;
    }

    function baseTokenURI() public pure returns (string) {
        return tokenURI;
    }

    function contractURI() public pure returns (string) {
        return contractURI;
    }
}
