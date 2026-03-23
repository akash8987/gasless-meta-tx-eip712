// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract MetaTokenVault is EIP712 {
    using ECDSA for bytes32;

    mapping(address => uint256) public nonces;
    mapping(address => uint256) public balances;

    bytes32 private constant EXECUTE_TYPEHASH = keccak256(
        "Execute(address user,uint256 amount,uint256 nonce)"
    );

    constructor() EIP712("MetaTokenVault", "1") {}

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    /**
     * @dev Executes a meta-transaction signed by the user.
     */
    function executeMetaTransfer(
        address user,
        address to,
        uint256 amount,
        uint256 nonce,
        bytes calldata signature
    ) external {
        require(nonce == nonces[user], "Invalid nonce");
        
        bytes32 structHash = keccak256(abi.encode(EXECUTE_TYPEHASH, user, amount, nonce));
        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = hash.recover(signature);

        require(signer == user, "Invalid signature");
        require(balances[user] >= amount, "Insufficient balance");

        nonces[user]++;
        balances[user] -= amount;
        balances[to] += amount;
    }
}
