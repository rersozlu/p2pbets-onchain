const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BetPool", function () {
  it("Should run all bet functions properly", async function () {
    const [deployer, randomAcc, thirdAcc] = await ethers.getSigners();
    const BetPool = await ethers.getContractFactory("BetPool");
    const betPool = await BetPool.deploy(deployer.address, 604800);
    await betPool.deployed();

    //deployer should be the owner
    expect(await betPool.getOwner()).to.equal(deployer.address);

    //Deployer puts a bet of 5 Avax to A option
    const betForA = await betPool.placeBetA({
      value: ethers.utils.parseEther("5"),
    });
    await betForA.wait();

    //RandomAcc puts a bet of 10 Avax to A option
    const betForB = await betPool
      .connect(randomAcc)
      .placeBetB({ value: ethers.utils.parseEther("10") });

    await betForB.wait();

    //ThirdAcc puts a bet of 5 Avax to A option
    const betForA2 = await betPool
      .connect(thirdAcc)
      .placeBetA({ value: ethers.utils.parseEther("5") });

    await betForA2.wait();

    //Deployer should have balancesA of 5.0 in the contract
    const balanceOfUserA = await betPool
      .balancesA(deployer.address)
      .then((num) => ethers.utils.formatEther(num));

    expect(balanceOfUserA).to.equal("5.0");

    //RandomAcc should have balancesA of 5.0 in the contract
    const balanceOfUserB = await betPool
      .balancesB(randomAcc.address)
      .then((num) => ethers.utils.formatEther(num));

    expect(balanceOfUserB).to.equal("10.0");

    //owner closes the bets for all... winner is A!
    const closingBets = await betPool.selectWinner(1);
    await closingBets.wait();

    //getting bet ratio for A if user invests 5 more
    const betRatioA = await betPool.getRatioForA();
    expect(betRatioA.toString()).to.equal("1850");

    //getting possible ratio for front-end
    const possibleRatio = await betPool.getNewRatio(
      ethers.utils.parseEther("5"),
      1
    );
    expect(betRatioA > possibleRatio).to.equal(true);

    //thirdAcc claims rewards. (returns 5 avax back) (rewards is 5/10 * 10 * 0.85)
    const priorBalance = await thirdAcc.getBalance();
    const claimRewards = await betPool.connect(thirdAcc).claimRewardA();
    await claimRewards.wait();
    const thirdAccBalance = await thirdAcc.getBalance();
    console.log(
      "third acc gave 5 avax which is 1/2 of winners and received 5 avax + half of 10 avax - fees: ",
      ethers.utils.formatEther((thirdAccBalance - priorBalance).toString())
    );
  });
});
