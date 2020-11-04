# The Ledger academy

This project illustrates various aspects of decentralized apps (Dapps). It has no real meaning but it might help you figuring out things. We're particularly concentrating on:

- connecting a React app with Ethereum wallets and networks
- playing with ERC20 tokens and their transfers, particularly
  - airdropping
  - escrowing
  - collateralizing
  - gas optimiziation
- demonstrating ERC721 / 777 / 1155 usage scenarios (tbd)
- implement, test & debug decentralized storage systems
  - IPFS (shared workers / debugging / Pubsub)
  - Arweave
  - Filecoin
  - SpaceDaemon
  - 3box threads
  - Textile Buckets
  - OrbitDB
- adding / verifying identities
  - 3box
  - ceramic
  - Jolocom
  - nacl-did
  - ether-did
- encryption
  - NaCL
  - FrodoKEM
  - on/off chain signature verification
- creating and validating zero knowledge proofs
- demonstrating Oracle usage
- demonstrating TheGraph chain queries

## reuse a your local bip39 mnemonic in docker-compose

`docker-compose --env-file ./.env.local up`

## auto deploys

this project auto deploys on fleek.co when new commits arrive on the `devel` branch. Fleek also builds all PR branches.

https://ledger-academy.on.fleek.co/

## Deploy your contracts...

`yarn run contracts`
create a mnemonic for you (`npx mnemonics`)
`cp .env .env.local`

```
{
    "MNEMONIC": <`npx mnemonics`>,
    "PROJECT_ID": <AN_INFURA_PROJECT_KEY>
}
```

then fund your 1st account with ether.
https://goerli-faucet.slock.it/
https://faucet.rinkeby.io/
https://faucet.ropsten.be/

and send some test ether to your metamask instance on the same network

then

`npx oz deploy` take down its address, add it to your `.env.(local)` as `REACT_APP_CONTRACT_ADDRESS`:

```
{
...,
"contractAddress": "0x7c9BeD2220B6A7545d31ad8911BAeB7003483337"
}
```

after contract has been compiled copy / link the compiled json definition into the src folder:

```
ln -s contracts/build/contracts/ADIToken.json src/contracts
```

now you can read its ABI from Javascript

## live instances:

goerli: `0x7c9BeD2220B6A7545d31ad8911BAeB7003483337`

## styles:

https://chakra-ui.com/
