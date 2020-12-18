import { Alert, AlertTitle, Text } from '@chakra-ui/core';
import { useIPFS } from 'context/IPFS';
import React from 'react';
import IPFSConnectKnownAddress, { knownTransports } from './IPFSConnectKnownAddress';

const IPFSSwarmAddressAlert = () => {
  const { swarmAddresses, addSwarmAddress } = useIPFS();

  return swarmAddresses.length > 0 ? <></> : <Alert mb={2}
            status={swarmAddresses.length === 0 ? 'error' : 'info'}
            justifyContent="space-between"
          >
            <AlertTitle>
            {(swarmAddresses.length === 0)
              ? <Text>no RTC nodes connected</Text>
              : <Text>{swarmAddresses.length} RTC nodes connected</Text>
            }
            </AlertTitle>
            {addSwarmAddress && <IPFSConnectKnownAddress
              knownAddresses={knownTransports}
              connect={addSwarmAddress}
              buttonProps={{
                size: 'xs',
                variantColor: 'blue',
                children: null,
              }}
            />}
      </Alert>;
};

export default IPFSSwarmAddressAlert;
