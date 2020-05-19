pragma solidity ^0.6.0;

import "@openzeppelin/contracts-ethereum-package/contracts/presets/ERC20PresetMinterPauser.sol";


contract ADIToken is ERC20PresetMinterPauserUpgradeSafe {
    function greet() public pure returns (string memory) {
        string memory g = "Bom Dia";
        return g;
    }
}
