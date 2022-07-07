//SPDX-License-Identifier: MIT

import "./BetPool.sol";
pragma solidity ^0.8.0;

contract BetPoolFactory {
    mapping(address => uint8) private isAllowed;
    event newPoolCreated(address newPool);

    constructor() {
        isAllowed[msg.sender] = 1;
    }

    function createNewBetPool(uint256 _timespan)
        external
        payable
        returns (address)
    {
        require(isAllowed[msg.sender] > 0, "Not allowed!");
        BetPool newPool = new BetPool(payable(msg.sender), _timespan);
        newPool.changeOwner(payable(msg.sender));
        emit newPoolCreated(address(newPool));
        return address(newPool);
    }

    function changeAllowance(address _newUser) external {
        require(isAllowed[msg.sender] > 0, "Not allowed!");
        isAllowed[_newUser] = isAllowed[_newUser] == 1 ? 0 : 1;
    }
}
