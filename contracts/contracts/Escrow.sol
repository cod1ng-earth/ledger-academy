pragma solidity ^0.6.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";

//https://medium.com/@pranav.89/smart-contracting-simplified-escrow-in-solidity-ethereum-b19761e8fe74
// a contract that escrows tokens and releases them on final call.
// and calls an anonymous function on the target contract
// once the seller (daccord contract) has "agreed" on the conditions

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

    function fulfill() external returns (bool) {
        require(msg.sender == daccord, "can only be called by daccord");
        // do what you must do.
        bool res = theToken.transfer(beneficiary, 5000);
        return res;
    }
}
