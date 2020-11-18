import { Flex, Link, Text } from '@chakra-ui/core';
import React from 'react';
import { FiGithub } from 'react-icons/fi';
import { GoZap } from 'react-icons/go';

const Footer = () => (
    <Flex bg="black" color="white" direction="row" wrap="wrap" justifyContent="space-between" >
        <Flex direction="column" p="4" gridGap={2} >
            <Flex direction="row" gridGap={2} align="center">
                <FiGithub size="20"></FiGithub>
                <Link href="https://github.com/cod1ng-earth/ledger-academy" isExternal>Improve on Github</Link>
            </Flex>
            <Flex direction="row" gridGap={2} align="center">
                <GoZap size="20"/>
                <Link href="https://app.fleek.co/#/sites/ledger-academy/" isExternal>hosted on IPFS with Fleek</Link>
            </Flex>
        </Flex>
        <Flex direction="column" p="4" >
            <Text>Built with</Text>
            <Flex gridGap={2} wrap="wrap" >
                <Link href="https://web3js.readthedocs.io/en/v1.3.0/" isExternal>web3</Link>
                <Link href="https://openzeppelin.com/" isExternal>OpenZeppelin</Link>
                <Link href="https://www.trufflesuite.com/docs/truffle/overview" isExternal>Truffle</Link>
                <Link href="https://js.ipfs.io/" isExternal>IPFS</Link>
                <Link href="https://orbitdb.org/" isExternal>OrbitDB</Link>
                <Link href="https://www.arweave.org/" isExternal>Arweave</Link>
                <Link href="https://chakra-ui.com/" isExternal>Chakra.UI</Link>
            </Flex>
        </Flex>
    </Flex>
);
export default Footer;
