//SPDX-License-Identifier: UNLICENSED
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

    // this would be nice. But you cannot do that. docs are storage but return types must be memory
    // https://ethereum.stackexchange.com/questions/11926/how-to-return-a-mapping-type

    /*function getAllDocuments()
        public
        view
        returns (mapping(address => bytes) memory docs)
    {
        return documents;
    }
    */

    //function getAllPeopleThatHaveADocument() public view returns (address[] people) {
    // return documents.keys??
    //}

    // you only can do (depends on your mapping's value type)
    function hasADocument(address owner) public view returns (bool) {
        return documents[owner].length > 0;
    }
}
