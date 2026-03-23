const { ethers } = require("hardhat");

async function main() {
  const [relayer, user] = await ethers.getSigners();
  
  const Vault = await ethers.getContractFactory("MetaTokenVault");
  const vault = await Vault.deploy();
  await vault.waitForDeployment();

  // User deposits some ETH
  await vault.connect(user).deposit({ value: ethers.parseEther("1") });

  const amount = ethers.parseEther("0.1");
  const nonce = await vault.nonces(user.address);
  const domain = {
    name: "MetaTokenVault",
    version: "1",
    chainId: (await ethers.provider.getNetwork()).chainId,
    verifyingContract: await vault.getAddress()
  };

  const types = {
    Execute: [
      { name: "user", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "nonce", type: "uint256" }
    ]
  };

  const value = {
    user: user.address,
    amount: amount,
    nonce: nonce
  };

  // User signs the message off-chain (no gas spent)
  const signature = await user.signTypedData(domain, types, value);

  // Relayer submits the transaction on-chain (Relayer pays gas)
  const tx = await vault.connect(relayer).executeMetaTransfer(
    user.address,
    relayer.address,
    amount,
    nonce,
    signature
  );

  await tx.wait();
  console.log("Meta-transaction successful! Relayer paid the gas.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
