# The Ledger academy

This project illustrates various aspects of decentralized apps (Dapps). It has no real meaning but it might help you figuring out things. We're particularly concentrating on:

- connecting a React app with Ethereum wallets and networks
- playing with ERC20 tokens and their transfers, particularly
  - [x] airdropping
  - [x] escrowing
  - collateralizing
  - gas optimization
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
  - [x] 3box
  - ceramic
  - Jolocom
  - nacl-did
  - ether-did
- encryption
  - [x] NaCL
  - [x] on/off chain signature verification
  - FrodoKEM
- creating and validating zero knowledge proofs
- demonstrating Oracle usage
- demonstrating TheGraph chain queries

## Prerequisites

you can create a fresh bip39 compatible mnemonic using this tool:

`src/cli/mnemonic.js`

This mnemonic will be reused in your local ganache chain & in your truffle enviroment. Put your local secrets / contract addresses here:

`cp .env .env.local`

start your local ganache blockchain:

`docker-compose --env-file ./.env.local up -d`

## Deploy your contracts...

We're using openzeppelin's awesome "upgradeable" contracts library to deploy all contracts. Since their cli is going away eoy 2020 we're using their [truffle upgrade plugins](https://docs.openzeppelin.com/upgrades-plugins/1.x/) instead.

Compile the contracts (so their ABIs are linked in src)
`yarn run contracts`

then fund your 1st account with ether.
https://goerli-faucet.slock.it/
https://faucet.rinkeby.io/
https://faucet.ropsten.be/

and send some test ether to your metamask instance on the same network.

To upgrade a contract with a newer version, look into the migrations `migrations/5_upgrade_adi.js`. The oz upgrade plugin will check if the current implementation on chain matches your code, if not, it'll deploy a new one and update its deployment manifests in `contracts/.openzeppelin`.

## interact with the contracts

in `contracts`, `npx truffle migrate` deploys the initial migrations & an upgradeable ADI token contract. Take down the final contract addresses if you want to test on your local chain: add them to your `.env.local` as `REACT_APP_CONTRACT_ADDRESS` (for the ADI token) and `REACT_APP_VALIDATOR_ADDRESS` (for the Verifier)

to directly interact with your deployed contracts you can open a `npx truffle console`. Then this works:

```
const adi = await ADIToken.deployed();
adi.greet()

> 'Bom Dia'
```

We added some convenience scripts in `contracts/scripts` that show ADI meta data (e.g. its current totalSupply) or mint fresh tokens. They can be used for automation and for faster local setup. Call them by

`npx truffle exec scripts/metaADI.js`

## using contracts from your React app

after the contracts have been compiled, check that the compiled json definition is linked into the src folder:

```
src/contracts/ADIToken.json -> contracts/build/contracts/ADIToken.json
```

now you can read its ABI from Javascript

## live instances:

### ADI Token
goerli: `0x7c9BeD2220B6A7545d31ad8911BAeB7003483337`

## Styles:

https://chakra-ui.com/

## auto deploys

this project auto deploys on fleek.co when new commits arrive on the `devel` branch. Fleek also builds all PR branches.

https://ledger-academy.on.fleek.co/

Tests are automatically ran on Travis. We're using an npx based ganache their (network `ci`)
