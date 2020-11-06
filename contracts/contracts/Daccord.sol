pragma solidity ^0.6.7;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";

contract Daccord is OwnableUpgradeSafe {
    address[] public voters;

    //https://medium.com/@houzier.saurav/calling-functions-of-other-contracts-on-solidity-9c80eed05e0f
    bytes public callPayload;
    address public targetContract;

    function initialize(
        address _targetContract,
        bytes memory _action //abi.encodeWithSignature("Test(uint, uint)", 12, 35);
    ) public initializer {
        __Ownable_init();
        targetContract = _targetContract;
        callPayload = _action;
    }

    function accept() public returns (bool, bytes memory) {
        voters.push(msg.sender);
        if (voters.length == 2) {
            return triggerExecution();
        }
        return (false, bytes("empty"));
    }

    function triggerExecution() public returns (bool, bytes memory) {
        (bool success, bytes memory returnData) = targetContract.call(
            callPayload
        );
        string memory ret = string(abi.encodePacked("res", string(returnData)));
        require(success, ret);
        return (success, returnData);
    }
}
