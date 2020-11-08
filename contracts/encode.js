const Web3 = require('web3');

const web3 = new Web3('http://localhost:7545');
const enc = web3.eth.abi.encodeFunctionSignature('fulfill()');
console.log(enc);
