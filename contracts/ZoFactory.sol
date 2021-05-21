// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title ZoFactory
 */

contract ZoFactory is Ownable, ERC721URIStorage {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string private _baseTokenURI;
    string private _baseContractURI;
    uint256 private _totalSupplyLimit;
    uint256 _baseBurningFee = 1 ether;

    struct Zombie {
        uint256 id;
        string name;
        uint256 burningFee;
    }

    Zombie[] private zombies;
    mapping (uint256 => Zombie) private tokenToZombie;
    mapping (uint256 => uint256) private tokenToBurnFee;

    constructor(string memory _tokenURI, string memory _contractURI, uint256 _supplyLimit) ERC721("NFTZombieFinal", "ZOMB") {
        _baseTokenURI = _tokenURI;
        _baseContractURI = _contractURI;
        _totalSupplyLimit = _supplyLimit;
    }

    modifier burnable(uint256 _tokenId) {
        require(msg.value >= tokenToBurnFee[_tokenId], "ZoFactory: Burn`s fee not allowed");
        _;

    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI();
    }

    function baseTokenURI() public view returns (string memory) {
        return _baseTokenURI;
    }

    function contractURI() public view returns (string memory) {
        return _baseContractURI;
    }

    function totalSupply() public view returns (uint256) {
        return zombies.length;
    }

    function totalSupplyLimit() public view returns (uint256) {
        return _totalSupplyLimit;
    }

    function createZombie(
        string memory name,
        uint256 burningFee
    ) public onlyOwner returns (Zombie memory) {
        require(totalSupply() < _totalSupplyLimit, "ZoFactory: total supply limit reached.");

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        Zombie memory newZombie = Zombie(newItemId, name, burningFee);

        zombies.push(newZombie);
        tokenToZombie[newItemId] = newZombie;
        tokenToBurnFee[newItemId] = burningFee * _baseBurningFee;

        _mint(owner(), newItemId);
        _setTokenURI(newItemId, newItemId.toString());

        return newZombie;
    }

    function setBaseTokenURI(string memory uri) public onlyOwner {
        _baseTokenURI = uri;
    }

    function setbaseContractURI(string memory uri) public onlyOwner {
        _baseContractURI = uri;
    }

    function tokenData(uint256 _tokenId) public view returns (Zombie memory) {
        require(_exists(_tokenId), "ZoFactory: URI query for nonexistent token");
        Zombie memory data = tokenToZombie[_tokenId];

        return data;
    }

    function transferToken(address to, uint256 tokenId) public returns (uint256) {
        _transfer(owner(), to, tokenId);
        return tokenId;
    }

    function destroyToken(uint256 _tokenId) public payable burnable(_tokenId) returns (uint256) {
        _burn(_tokenId);
        return _tokenId;
    }

    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function withdraw(uint256 amount) external onlyOwner {
        uint256 balance = address(this).balance;
        address payable recipient = payable(owner());

        if (amount <= balance) {
            recipient.transfer(amount);
        } else {
            recipient.transfer(balance);
        }
    }
}
