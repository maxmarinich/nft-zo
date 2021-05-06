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

    constructor(string memory _tokenURI, string memory _contractURI) ERC721("NFTZombies", "ZNFT") {
        console.log("Deploying the NFTZombie ...", _tokenURI, _contractURI);

        _baseTokenURI = _tokenURI;
        _baseContractURI = _contractURI;

        _createZombie('Tony 1', 'ZOP 2', 'LOLOLOLO 2', 'POL 2', 'SUB-1 2');
        _createZombie('Tony 2', 'ZOP 2', 'LOLOLOLO 2', 'POL 2', 'SUB-1 2');
        _createZombie('Tony 3', 'ZOP 2', 'LOLOLOLO 2', 'POL 2', 'SUB-1 2');
        _createZombie('Tony 4', 'ZOP 2', 'LOLOLOLO 2', 'POL 2', 'SUB-1 2');
        _createZombie('Tony 5', 'ZOP 2', 'LOLOLOLO 2', 'POL 2', 'SUB-1 2');
        _createZombie('Tony 6', 'ZOP 2', 'LOLOLOLO 2', 'POL 2', 'SUB-1 2');
        _createZombie('Tony 7', 'ZOP 2', 'LOLOLOLO 2', 'POL 2', 'SUB-1 2');
        _createZombie('Tony 8', 'ZOP 2', 'LOLOLOLO 2', 'POL 2', 'SUB-1 2');
        _createZombie('Tony 9', 'ZOP 2', 'LOLOLOLO 2', 'POL 2', 'SUB-1 2');
        _createZombie('Tony 10', 'ZOP 2', 'LOLOLOLO 2', 'POL 2', 'SUB-1 2');
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function _createZombie(
        string memory name,
        string memory rank,
        string memory category,
        string memory subcategory,
        string memory born
    ) public onlyOwner returns (Zombie memory) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        Zombie memory newZombie = Zombie(newItemId, name, rank, category, subcategory, born);

        zombies.push(newZombie);
        tokenToZombie[newItemId - 1] = newZombie;

        _mint(owner(), newItemId);
        _setTokenURI(newItemId, newItemId.toString());

        return newZombie;
    }

    function getTokenData(uint256 _tokenId) public view returns (Zombie memory) {
        require(_exists(_tokenId), "ERC721URIStorage: URI query for nonexistent token");

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
