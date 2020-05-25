pragma solidity ^0.6.0;


contract DocExchange {
    event DocumentAdded(address owner, bytes cid);

    mapping(address => bytes) documents;

    function addDocument(bytes memory cid) public {
        documents[msg.sender] = cid;
        emit DocumentAdded(msg.sender, cid);
    }

    function getMyDocument() public view returns (bytes memory cid) {
        return documents[msg.sender];
    }
}
