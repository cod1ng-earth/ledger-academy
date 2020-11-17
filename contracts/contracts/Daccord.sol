pragma solidity ^0.6.7;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";

contract Daccord is OwnableUpgradeable {
    mapping(address => bool) public votes;
    address[] public voters;

    bytes public callPayload;
    address public targetContract;

    bool public isOpen;
    bool public isFulfilled;

    event AddedCandidate(address candidate);

    event ClosedBallot();

    event Fulfilled(string fulfillmentResult);

    function initialize(
        address _targetContract,
        bytes memory _action //abi.encodeWithSignature("Test(uint, uint)", 12, 35);
    ) public initializer {
        __Ownable_init();
        targetContract = _targetContract;
        callPayload = _action;
        isOpen = true;
        isFulfilled = false;
    }

    function isOnBallot(address addr) public view returns (bool) {
        for (uint256 i = 0; i < voters.length; i++) {
            if (voters[i] == addr) return true;
        }
        return false;
    }

    //you could also use a majority. Get creative.
    function everyoneAgreed() public view returns (bool) {
        if (voters.length == 0) {
            return false;
        }
        for (uint256 i = 0; i < voters.length; i++) {
            if (votes[voters[i]] == false) return false;
        }

        return true;
    }

    //whoever has the right to add voters.
    function addVoter(address addr) public onlyOwner {
        require(isOpen, "the voting is closed");
        require(!isFulfilled, "the ballot is fulfilled");
        require(!isOnBallot(addr), "already on ballot");
        voters.push(addr);
        votes[addr] = false;
        emit AddedCandidate(addr);
    }

    function closeForNewVoters() public onlyOwner {
        require(!isFulfilled, "the ballot is fulfilled");
        isOpen = false;
        emit ClosedBallot();
    }

    // if you're the last agreer, you're triggering the fulfillment!
    // you could also leave the trigger open to another party to call.
    function agree() public {
        require(isOnBallot(msg.sender), "you're not on the ballot");
        votes[msg.sender] = true;

        if (everyoneAgreed()) {
            (bool success, string memory result) = triggerExecution();
            if (success) {
                isFulfilled = true;
                emit Fulfilled(result);
            } else {
                isFulfilled = false; // unnecessary since we're reverting.
                revert(result);
            }
        }
    }

    //https://medium.com/@houzier.saurav/calling-functions-of-other-contracts-on-solidity-9c80eed05e0f
    function triggerExecution() internal returns (bool, string memory) {
        require(!isFulfilled, "the ballot is fulfilled");
        require(everyoneAgreed(), "everyone must agree first");

        (bool success, bytes memory returnData) = targetContract.call(
            callPayload
        );
        string memory ret = string(returnData);
        // not changing the isFulfilled state here -> maybe we want to call this again?

        return (success, ret);
    }
}
