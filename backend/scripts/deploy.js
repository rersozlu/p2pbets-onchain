const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const BetPool = await hre.ethers.getContractFactory("BetPool");
  const betPool = await BetPool.deploy(deployer.address, 604800);

  await betPool.deployed();

  console.log("betPool deployed to:", betPool.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
