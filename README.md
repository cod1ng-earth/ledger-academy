# The Ledger academy

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
