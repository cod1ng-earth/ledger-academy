pragma solidity ^0.6.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";

//https://medium.com/@pranav.89/smart-contracting-simplified-escrow-in-solidity-ethereum-b19761e8fe74
// collects an arbitrary amt of a given ERC20 token and releases it to a beneficiary
// Doesn't know anything about the "daccord" contract, except its address.
// the seller (daccord contract) has "agreed" on the conditions

contract TokenEscrow is OwnableUpgradeSafe {
    IERC20 theToken;
    address public beneficiary;
    address public daccord;
    uint256 private start;

    function initialize(IERC20 erc20, address beneficiary_address)
        public
        initializer
    {
        __Ownable_init();
        theToken = erc20;
        beneficiary = beneficiary_address;
        start = now;
    }

    function setDaccord(address daccord_address) public onlyOwner {
        daccord = daccord_address;
    }

    function depositTokens() public {
        theToken.transferFrom(msg.sender, address(this), 5000);
    }

    function getEscrowedTokenBalance() public view returns (uint256) {
        return theToken.balanceOf(address(this));
    }

    // do whatever you need to "fulfill" the escrow after an agreement
    function fulfill() external returns (bool) {
        require(msg.sender == daccord, "can only be called by daccord");
        uint256 amount = getEscrowedTokenBalance();
        bool res = theToken.transfer(beneficiary, amount);
        return res;
    }
}
