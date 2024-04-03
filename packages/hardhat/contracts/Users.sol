// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Users {
	// mapping fo user credits
	mapping(address => uint256) public credits;

	event UserFunded(address userId, uint256 credits);
	event CreditUsed(address userId);

	/**
	 * @dev internal function (do checks before calling it)
	 * emits FeeUpdated event.
	 */
	function _fundUser(uint256 _newCredits) internal {
		credits[msg.sender] += _newCredits;
		emit UserFunded(msg.sender, _newCredits);
	}

	/**
	 * @dev internal function for decreasing the credits
	 * emits CreditUsed event.
	 */
	function _useCredit(address _userId) internal {
		credits[_userId] -= 1;
		emit CreditUsed(_userId); // event might not be needed (adding it to follow convention)
	}

	/**
	 * @dev Function to get user's credits.
	 * @param _userId The user to fund.
	 * @return The user's credits.
	 */
	function getUserCredits(address _userId) public view returns (uint256) {
		return credits[_userId];
	}
}
