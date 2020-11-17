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

This is a Typescript based React project. You very likely want to have a node development environment on your machine. We strongly recommend to [use nvm to install](nvm.sh) a clean and controlled local node installation. It's common practice and you'll see that it simplifies your node life **a lot**.

Start by copying the `.env` to an `.env.local` file 

```
cp .env .env.local
```

and fill out the most basic things. Mandatory to run this a first time only `MNEMONIC`. You can create a fresh bip39 compatible mnemonic using this tool:

`node src/cli/mnemonic.js`

This mnemonic will be reused in your local ganache chain & in your truffle enviroment. We're added a docker-compose file to start a local ganache blockchain for you:

`docker-compose --env-file ./.env.local up -d`

### get test ether

If you want to interact with contracts on "real" testnets, fund your 1st account with ether:

https://goerli-faucet.slock.it/
https://faucet.rinkeby.io/
https://faucet.ropsten.be/


## Deploy your contracts

We're using openzeppelin's awesome "upgradeable" contracts library to deploy all contracts. Since their cli is going away eoy 2020 we're using their [truffle upgrade plugins](https://docs.openzeppelin.com/upgrades-plugins/1.x/).

Compile the contracts (so their ABIs are linked in src)
```
yarn run contracts
``` 

To upgrade a contract with a newer version, look into the migration `migrations/5_upgrade_adi.js`. The oz upgrade plugin will check if the current implementation on chain matches your code, if not, it'll deploy a new one and update its deployment manifests in `contracts/.openzeppelin`.

## interact with the contracts

`cd contracts` and `npx truffle migrate` deploys the initial migrations & an upgradeable ADI token contract. Take down the final contract addresses if you want to test on your local chain: add them to your `.env.local` as `REACT_APP_CONTRACT_ADDRESS` (for the ADI token) and `REACT_APP_VALIDATOR_ADDRESS` for the Verifier

to directly interact with your deployed contracts you can open a `npx truffle console`. Then this works:

```
const adi = await ADIToken.deployed();
adi.greet()

> 'Bom Dia'
```

We added some convenience scripts in `contracts/scripts` that displays ADI meta data (e.g. its current totalSupply) or mint fresh tokens. They can be used for automation and for faster local setup. Call them by

`npx truffle exec scripts/metaADI.js` or
`npx truffle exec --network goerli scripts/balance.js ` to see the balances of all your accounts.

## using contracts from your React app

after the contracts have been compiled, check that the compiled json definition is linked into the src folder (the links are in git so they should):

```
src/contracts/ADIToken.json -> contracts/build/truffle/ADIToken.json
```

now you can access their ABIs from Javascript

## public network instances:

if you'd like to deploy your very own live instance of the contracts, feel free to use a command like:

```
npx truffle migrate --network goerli
```

note, that Infura might have problems keeping up the connection. This is a known issue: https://github.com/trufflesuite/truffle/issues/3356, hence we switched to a websocket provider in `truffle-config.js`. 

If you deployed some contracts you can check their addresses using

```
npx truffle networks
```

### ADI Token
goerli: `0xb65b87423455ac85f9A308C282528f8C25d252F9`

## Styles:

https://chakra-ui.com/

## auto deploys

this project auto deploys on fleek.co when new commits arrive on the `devel` branch. Fleek also builds all PR branches.

https://ledger-academy.on.fleek.co/

Tests are automatically ran [on Travis](https://travis-ci.org/github/cod1ng-earth/ledger-academy). We're using an npx based ganache there (network `ci`)
