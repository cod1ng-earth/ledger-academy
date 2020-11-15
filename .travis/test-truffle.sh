#!/bin/bash
 
set -e
cd contracts 
npx ganache-cli --networkId=5779 --gasPrice=5e9 2> /dev/null 1> /dev/null &
sleep 5 # to make sure ganache-cli is up and running before compiling
rm -rf build
npx truffle compile
npx truffle migrate --reset --network ci
npx truffle test --network ci
kill -9 $(lsof -t -i:8545)