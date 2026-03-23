# Gasless Meta-Transactions (EIP-712)

A professional-grade repository for building gasless Web3 experiences. This project implements the EIP-712 standard for typed structured data hashing and signing, enabling "Meta-Transactions" where a third-party (Relayer) pays the gas fees on behalf of the user.

## Features
* **EIP-712 Compliance:** Secure signing of structured data to prevent replay attacks.
* **Signature Verification:** On-chain `ecrecover` logic to validate the signer's intent.
* **Nonces Management:** Built-in protection against transaction re-ordering and re-entry.
* **Relayer Integration:** Clean separation between the User (Signer) and the Relayer (Executor).

## Workflow
1. **Sign:** User signs a message off-chain containing transaction details (Target, Data, Nonce).
2. **Relay:** Relayer receives the signature and calls the `execute` function on-chain.
3. **Validate:** The contract verifies the signature and executes the internal call.

## Quick Start
1. `npm install`
2. Run `npx hardhat test` to see the signing and execution flow in action.
