const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const BetPoolFactory = await hre.ethers.getContractFactory("BetPoolFactory");
  const betPoolFactory = await BetPoolFactory.deploy();

  await betPoolFactory.deployed();

  console.log("betPoolFactory deployed to:", betPoolFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//deployed address 0x7BAf7630E74851a80c60aC160e5327815953fb5b
