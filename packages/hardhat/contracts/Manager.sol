// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {Users} from "./Users.sol";
import {FilesManager} from "./FilesManager.sol";

contract Manager is Users, FilesManager, Ownable {
    uint256 creditsPrice;

    event CreditsPriceUpdated(uint256 newCreditsPrice);

    error InvalidNewCreditsPrice(uint256 newCreditsPrice);
    error InvalidValue(uint256 value, uint256 expectedValue);
    error NotEnoughCredits(address userId);

    // Constructor to set the initial creditsPrice
    constructor(uint256 _creditsPrice) Ownable(msg.sender) {
        creditsPrice = _creditsPrice;
        emit CreditsPriceUpdated(_creditsPrice);
    }

    function fundUser(uint256 _newCredits) public payable {
        uint256 calculatedValue = _calcValue(_newCredits);
        if (msg.value != calculatedValue) revert InvalidValue(msg.value, calculatedValue);
        _fundUser(_newCredits);
        // todo add logic to store the info in TableLand
    }

    /**
     * @dev Function to update the creditsPrice.
     * @param _newCreditsPrice The new credit price.
     * emits CreditsPriceUpdated event.
     */
    function updateFee(uint256 _newCreditsPrice) public onlyOwner {
        uint256 _oldCreditsPrice = creditsPrice;
        if (_newCreditsPrice == 0 || _newCreditsPrice == _oldCreditsPrice)
            revert InvalidNewCreditsPrice(_newCreditsPrice);
        creditsPrice = _newCreditsPrice;
        emit CreditsPriceUpdated(_newCreditsPrice);
    }

    function createFile(
        uint256 _fileId,
        string memory _transcriptCid,
        string memory _analysisCid
    ) public {
        // todo think on checks that should be done before calling
        _createFile(_fileId, _transcriptCid, _analysisCid);
        // ! the credits should decrease (we are not returning file info)? in case they should are we sure that the msg.sender is the user?
        // ! if credits should be decreased, should also check the user has credits
    }

    function getFile(uint256 _fileId) public returns (FileInfo memory) {
        if (users[msg.sender] == 0) revert NotEnoughCredits(msg.sender);
        _useCredit(msg.sender);
        // todo think if other checks should be added before calling
        return _getFile(_fileId);
    }

    // helper
    function _calcValue(uint256 _credits) internal view returns (uint256) {
        return _credits * creditsPrice;
    }
}
