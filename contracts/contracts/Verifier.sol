//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "@openzeppelin/contracts-upgradeable/cryptography/ECDSAUpgradeable.sol";

// https://www.codementor.io/@yosriady/signing-and-verifying-ethereum-signatures-vhe8ro3h6
// -> part of oz: https://docs.openzeppelin.com/contracts/3.x/api/cryptography#ECDSA-recover-bytes32-bytes-

contract Verifier {
    function recoverAddr(bytes32 msgHash, bytes memory signature)
        public
        pure
        returns (address)
    {
        return ECDSAUpgradeable.recover(msgHash, signature);
    }

    function recoverAddrFromNonEthHash(bytes32 msgHash, bytes memory signature)
        public
        pure
        returns (address)
    {
        bytes32 ethHash = ECDSAUpgradeable.toEthSignedMessageHash(msgHash);
        return recoverAddr(ethHash, signature);
    }
}
