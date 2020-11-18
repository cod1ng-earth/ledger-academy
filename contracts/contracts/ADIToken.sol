//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "@openzeppelin/contracts-upgradeable/presets/ERC20PresetMinterPauserUpgradeable.sol";

contract ADIToken is ERC20PresetMinterPauserUpgradeable {
    uint256 public ethBalance;

    uint256 public counter;

    // 1 event Greeted(address to);
    // 2 event Greeted(address to, uint256 someValue);
    // 3:
    event Greeted(address to, uint256 someValue, uint8 anotherValue);

    function greet() public returns (string memory) {
        string memory g = "Bom Dia";
        counter = counter + 1;
        emit Greeted(msg.sender, counter, 42);
        return g;
    }

    /*
     * converts "ETH" to "ADI"
     */
    function exchange() public payable {
        require(msg.value > 1e9, "send at least 1gwei (1000000000) eth");
        require(balanceOf(address(this)) > msg.value);
        ethBalance += msg.value;
        _transfer(address(this), msg.sender, msg.value);
    }

    function withdraw() public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "only owner can withdraw"
        );
        msg.sender.transfer(ethBalance);
        ethBalance = 0;
    }

    function airdrop(address[] memory recipients, uint256[] memory amounts)
        public
    {
        require(recipients.length == amounts.length, "unmatched input lengths");

        uint256 total = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            total += amounts[i];
        }

        require(
            balanceOf(msg.sender) >= total,
            "your token balance is too low"
        );

        for (uint256 j = 0; j < recipients.length; j++) {
            if (amounts[j] > 0) {
                transfer(recipients[j], amounts[j]);
            }
        }
    }
}
