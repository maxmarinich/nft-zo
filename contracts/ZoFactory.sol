// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ZoFactory is Ownable, ERC721URIStorage {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string private _baseTokenURI;
    string private _baseContractURI;
    uint256 private _totalSupplyLimit;

    struct Zombie {
        uint256 id;
        string name;
        string rank;
        string category;
        string subcategory;
        string born;
    }

    Zombie[] private zombies;

    mapping (uint256 => Zombie) public tokenToZombie;

    constructor(string memory _tokenURI, string memory _contractURI, uint256 _supplyLimit) ERC721("NFTZomb", "ZOMB") {
        console.log("ZoFactory: Deploying the NFTZombie ...", _tokenURI, _contractURI, _supplyLimit);

        _baseTokenURI = _tokenURI;
        _baseContractURI = _contractURI;
        _totalSupplyLimit = _supplyLimit;
    }

    function getAllZombies() public view returns (Zombie[] memory) {
        return zombies;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function createZombie(
        string memory name,
        string memory rank,
        string memory category,
        string memory subcategory,
        string memory born
    ) public onlyOwner returns (Zombie memory) {
        require(totalSupply() < _totalSupplyLimit, "ZoFactory: total supply limit reached.");

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        Zombie memory newZombie = Zombie(newItemId, name, rank, category, subcategory, born);

        zombies.push(newZombie);
        tokenToZombie[newItemId - 1] = newZombie;

        _mint(owner(), newItemId);
        _setTokenURI(newItemId, newItemId.toString());

        return newZombie;
    }

    function totalSupply() public view returns (uint256) {
        return zombies.length;
    }

    function totalSupplyLimit() public view returns (uint256) {
        return _totalSupplyLimit;
    }


    function getTokenData(uint256 _tokenId) public view returns (Zombie memory) {
        require(_exists(_tokenId), "ZoFactory: URI query for nonexistent token");

        Zombie memory zombie = tokenToZombie[_tokenId - 1];

        return zombie;
    }

    function destroyToken(uint256 _tokenId) public {
        _burn(_tokenId);
    }

    function baseTokenURI() public view returns (string memory) {
        return _baseTokenURI;
    }

    function contractURI() public view returns (string memory) {
        return _baseContractURI;
    }
}
