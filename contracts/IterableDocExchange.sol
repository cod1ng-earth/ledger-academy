//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

//https://ethereum.stackexchange.com/questions/30305/how-to-create-an-array-of-unique-addresses
//https://ethereum.stackexchange.com/questions/1527/how-to-delete-an-element-at-a-certain-index-in-an-array
//https://programtheblockchain.com/posts/2018/03/09/understanding-ethereum-smart-contract-storage/
//https://medium.com/@jeancvllr/solidity-tutorial-all-about-addresses-ffcdf7efc4e7
//https://github.com/willitscale/learning-solidity/blob/master/support/NESTED_ARRAYS_NOT_IMPLEMENTED.MD#12-where-cant-i-use-nested-arrays

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";


/**
 *  a contract that saves an iterable list of bytes32
 */
contract IterableDocExchange is Initializable {
    mapping(address => uint256) index; // owner => index in store
    bytes32[] store; // cids for our users, indexed as integer

    uint256 r_size; //the running size of the index for simpler returns

    function initialize() public initializer {
        // We will use position 0 to flag invalid address
        store.push(0x0); //https://solidity.readthedocs.io/en/v0.6.8/types.html#array-members
    }

    function addMyDoc(bytes32 cid) public {
        if (inArray(msg.sender)) {
            removeMyDoc();
        }

        index[msg.sender] = store.length; //the last index
        store.push(cid);
        r_size++;
    }

    function removeMyDoc() public {
        uint256 position = indexOf(msg.sender);
        require(position != 0, "you don't have a document");
        delete store[position];
        index[msg.sender] = 0;
        r_size--;
    }

    function inArray(address who) public view returns (bool) {
        // address 0x0 is not valid if pos is 0 is not in the array
        if (who != address(0x0) && index[who] > 0) {
            return true;
        }
        return false;
    }

    function getMyDoc() public view returns (bytes32 cid) {
        require(inArray(msg.sender), "you don't have a document");
        uint256 pos = indexOf(msg.sender);
        return get(pos);
    }

    function indexOf(address addr) public view returns (uint256) {
        return index[addr];
    }

    function get(uint256 pos) public view returns (bytes32 cid) {
        require(pos > 0, "Position 0 is not valid");

        return store[pos];
    }

    function getAllDocs() public view returns (bytes32[] memory) {
        bytes32[] memory _cids = new bytes32[](r_size);
        uint256 n = 0;

        for (uint256 i = 0; i < store.length; i++) {
            if (store[i] != bytes32(0x0)) {
                _cids[n] = store[i];
                n++;
            }
        }

        return (_cids);
    }
}
