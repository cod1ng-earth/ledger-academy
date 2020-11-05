//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "@openzeppelin/contracts-ethereum-package/contracts/presets/ERC20PresetMinterPauser.sol";

contract ADIToken is ERC20PresetMinterPauserUpgradeSafe {
    uint256 public ethBalance = 0;

    function greet() public pure returns (string memory) {
        string memory g = "Bom Dia";
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
