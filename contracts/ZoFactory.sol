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

    struct Token {
        uint256 id;
        string name;
        uint256 burningFee;
    }

    Token[] private tokens;
    mapping (uint256 => Token) private _idToToken;
    mapping (uint256 => uint256) private _tokenToBurnFee;
    mapping (uint256 => address) private _burnedToOwners;

    constructor(string memory _tokenURI, string memory _contractURI, uint256 _supplyLimit) ERC721("NFTZombieFinal", "ZOMB") {
        _baseTokenURI = _tokenURI;
        _baseContractURI = _contractURI;
        _totalSupplyLimit = _supplyLimit;
    }

    modifier burnable(uint256 _tokenId) {
        require(msg.value >= _tokenToBurnFee[_tokenId], "ZoFactory: Burn`s fee not allowed");
        _;

    }

    modifier nonburned(uint256 _tokenId) {
        require(_burnedToOwners[_tokenId] != address(0), "ZoFactory: Query for burned token");
        _;

    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI();
    }

    function baseTokenURI() public view returns (string memory) {
        return _baseTokenURI;
    }

    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function contractURI() public view returns (string memory) {
        return _baseContractURI;
    }

    function createToken(string memory name, uint256 burningFee) public onlyOwner returns (Token memory) {
        require(totalSupply() < _totalSupplyLimit, "ZoFactory: Total supply limit reached");

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        Token memory newToken = Token(newItemId, name, burningFee);

        tokens.push(newToken);
        _idToToken[newItemId] = newToken;
        _tokenToBurnFee[newItemId] = burningFee * _baseBurningFee;

        _mint(owner(), newItemId);
        _setTokenURI(newItemId, newItemId.toString());

        return newToken;
    }

    function setBaseTokenURI(string memory uri) public onlyOwner {
        _baseTokenURI = uri;
    }

    function setBaseContractURI(string memory uri) public onlyOwner {
        _baseContractURI = uri;
    }

    function tokenData(uint256 _tokenId) public nonburned(_tokenId) view returns (Token memory) {
        require(_exists(_tokenId), "ZoFactory: Query for nonexistent token");
        Token memory data = _idToToken[_tokenId];

        return data;
    }
    function tokenURI(uint256 _tokenId) public nonburned(_tokenId) view override returns (string memory) {
        return super.tokenURI(_tokenId);
    }

    function totalSupply() public view returns (uint256) {
        return tokens.length;
    }

    function totalSupplyLimit() public view returns (uint256) {
        return _totalSupplyLimit;
    }

    function transferToken(address to, uint256 tokenId) public returns (uint256) {
        _transfer(owner(), to, tokenId);
        return tokenId;
    }

    function burnToken(uint256 _tokenId) public payable burnable(_tokenId) returns (uint256) {
        _burn(_tokenId);
        _burnedToOwners[_tokenId] = msg.sender;
        return _tokenId;
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
