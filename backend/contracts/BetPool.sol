//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

//@author rersozlu
contract BetPool {
    //constants
    uint256 constant feePercentage = 15;
    //immutable parameters
    address payable immutable owner;
    uint256 immutable deployTime;
    uint256 immutable expiryTime;

    constructor(address payable _owner, uint256 _timeSpan) {
        owner = _owner;
        deployTime = block.timestamp;
        expiryTime = block.timestamp + _timeSpan;
    }

    //state variables
    mapping(address => uint256) public balancesA;
    mapping(address => uint256) public balancesB;
    uint256 public totalBalanceA;
    uint256 public totalBalanceB;
    uint8 winnerIndex = 0; //will change to 3 as soon as the bet closes!

    //events & modifiers
    event BetPlaced(address from, uint8 option, uint256 amount);
    event RewardClaimed(address to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    //read functions

    function getOwner() external view returns (address) {
        return owner;
    }

    function getExpiry() external view returns (uint256) {
        return expiryTime;
    }

    //@returns current ROI ratio for A players
    function getRatioForA() external view returns (uint256) {
        if (totalBalanceB == 0) return 1000;
        if (totalBalanceA == 0) return (1000 + (totalBalanceB / (10**15)));

        return (1000 +
            ((1000 * totalBalanceB * (100 - feePercentage)) /
                (100 * totalBalanceA)));
    }

    //@returns current ROI ratio for B players
    function getRatioForB() external view returns (uint256) {
        if (totalBalanceA == 0) return 1000;
        if (totalBalanceB == 0) return (1000 + (totalBalanceA / (10**15)));

        return (1000 +
            ((1000 * totalBalanceA * (100 - feePercentage)) /
                (100 * totalBalanceB)));
    }

    //@returns possible ratio, takes input and calculates the ROI if the amount is played
    function getNewRatio(uint256 _potentialBetAmount, uint256 _betSide)
        external
        view
        returns (uint256 potentialRatio_)
    {
        require(_betSide == 1 || _betSide == 2, "Not such an option found!");
        if (_potentialBetAmount == 0) return 0;
        if (totalBalanceB == 0) return 0;
        if (totalBalanceA == 0) return 0;
        if (_betSide == 1) {
            uint256 _totalBalanceA = totalBalanceA + _potentialBetAmount;
            uint256 _newRatio = (1000 +
                ((1000 * totalBalanceB * (100 - feePercentage)) /
                    (100 * _totalBalanceA)));
            return _newRatio;
        }
        if (_betSide == 2) {
            uint256 _totalBalanceB = totalBalanceB + _potentialBetAmount;
            uint256 _newRatio = (1000 +
                ((1000 * totalBalanceA * (100 - feePercentage)) /
                    (100 * _totalBalanceB)));
            return _newRatio;
        }
    }

    //write functions

    function placeBetA() external payable {
        require(msg.value > 0, "Bet cannot be 0");
        require(winnerIndex == 0, "Bets closed!");
        require(expiryTime > block.timestamp, "Bets closed!");
        balancesA[msg.sender] += msg.value;
        totalBalanceA += msg.value;
        emit BetPlaced(msg.sender, 1, msg.value);
    }

    function placeBetB() external payable {
        require(msg.value > 0, "Bet cannot be 0");
        require(winnerIndex == 0, "Bets closed!");
        require(expiryTime > block.timestamp, "Bets closed!");
        balancesB[msg.sender] += msg.value;
        totalBalanceB += msg.value;
        emit BetPlaced(msg.sender, 2, msg.value);
    }

    //@param
    //0:bets still open
    //1:A wins
    //2:B wins
    //3:Bets closed, winner not decided yet
    function selectWinner(uint8 _winnerIndex) external onlyOwner {
        require(_winnerIndex < 4, "Not valid call");
        winnerIndex = _winnerIndex;
    }

    function claimRewardA() external {
        require(winnerIndex == 1, "This bet either is not closed, or is lost!");
        require(
            balancesA[msg.sender] > 0,
            "You did not place a bet on this option!"
        );
        uint256 initialShareOfUser = balancesA[msg.sender];
        uint256 rewardOfUser = ((balancesA[msg.sender] *
            totalBalanceB *
            (100 - feePercentage)) / (totalBalanceA * 100));

        balancesA[msg.sender] = 0;

        if (totalBalanceB == 0) {
            payable(msg.sender).transfer(initialShareOfUser);
            emit RewardClaimed(msg.sender, initialShareOfUser);
        }
        if (totalBalanceB > 0) {
            uint256 totalShare = initialShareOfUser + rewardOfUser;
            payable(msg.sender).transfer(totalShare);
            emit RewardClaimed(msg.sender, totalShare);
        }
    }

    function claimRewardB() external {
        require(winnerIndex == 2, "This bet either is not closed, or is lost!");
        require(
            balancesB[msg.sender] > 0,
            "You did not place a bet on this option!"
        );
        uint256 initialShareOfUser = balancesB[msg.sender];
        uint256 rewardOfUser = ((balancesB[msg.sender] *
            totalBalanceA *
            (100 - feePercentage)) / (totalBalanceB * 100));

        balancesB[msg.sender] = 0;

        if (totalBalanceA == 0) {
            payable(msg.sender).transfer(initialShareOfUser);
            emit RewardClaimed(msg.sender, initialShareOfUser);
        }
        if (totalBalanceA > 0) {
            uint256 totalShare = initialShareOfUser + rewardOfUser;
            payable(msg.sender).transfer(totalShare);
            emit RewardClaimed(msg.sender, totalShare);
        }
    }

    //to collect fee's after withdrawals- this option will be available after a week of contract deployment
    function withdrawAll() external onlyOwner {
        require(block.timestamp > deployTime + 7 days, "not available yet!");
        owner.transfer(address(this).balance);
    }

    //we dont want someone to send money directly!

    receive() external payable {
        revert();
    }

    fallback() external payable {
        revert();
    }
}
