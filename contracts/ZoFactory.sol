// contracts/MyContract.sol
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

    mapping (uint256 => address) public zombieToOwner;
    mapping (address => uint256) public ownerZombieCount;

    constructor(string memory _tokenURI, string memory _contractURI) ERC721("NFTZombie", "NZMB") {
        console.log("Deploying the NFTZombie ...", _tokenURI, _contractURI);

        _baseTokenURI = _tokenURI;
        _baseContractURI = _contractURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function createZombie() public onlyOwner returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

        _mint(owner(), newItemId);
        _setTokenURI(newItemId, newItemId.toString());

        return newItemId;
    }

    function baseTokenURI() public view returns (string memory) {
        return _baseTokenURI;
    }

    function contractURI() public view returns (string memory) {
        return _baseContractURI;
    }
}
