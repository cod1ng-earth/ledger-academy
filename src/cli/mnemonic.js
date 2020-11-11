#!/usr/bin/env node

// const { getRandomBytesSync } = require("ethereum-cryptography/random");
const {
  generateMnemonic, mnemonicToSeed, validateMnemonic, mnemonicToEntropy,
} = require('ethereum-cryptography/bip39');
const { wordlist } = require('ethereum-cryptography/bip39/wordlists/english');

const mne = generateMnemonic(wordlist);
console.log('Mnemonic:', mne);

console.log('valid:', validateMnemonic(mne, wordlist));
// mnemonicToSeed(mne).then(console.log);
