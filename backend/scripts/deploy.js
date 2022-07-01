const hre = require("hardhat");

async function main() {
  const BetPool = await hre.ethers.getContractFactory("BetPool");
  const betPool = await BetPool.deploy();

  await betPool.deployed();

  console.log("betPool deployed to:", betPool.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
