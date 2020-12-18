import React from 'react';

import {
  ButtonGroup, Button, Tooltip, ButtonProps,
} from '@chakra-ui/core';

export interface IKnownAddress {
    name: string;
    address: string;
}

export const knownSwarmPeers: IKnownAddress[] = [
  {
    name: 'Coding.Earth',
    address: '/dns4/ipfs.coding.earth/tcp/4002/wss/p2p/12D3KooWPMH57dcaZPjw9MjF7q8hZgf446s6g4s9BbX1BGRztwTC',
  },
  {
    name: 'Depa Digital',
    address: '/dns4/ipfs.depa.digital/tcp/4002/wss/p2p/QmXAghnP7DqmAEE7Zx4SxMo3UcUVSn8f1xDCT6x1ysYMSj',
  },
];

export const knownTransports: IKnownAddress[] = [
  {
    name: 'Coding.Earth WRTC Star',
    address: '/dns4/ipfs.coding.earth/tcp/9090/wss/p2p-webrtc-star/',
  },
  {
    name: 'Depa.Digital WRTC Star',
    address: '/dns4/ipfs.depa.digital/tcp/9091/wss/p2p-webrtc-star/',
  },
];

const IPFSConnectKnownAddress = ({ knownAddresses, connect, buttonProps }: {
    knownAddresses: IKnownAddress[],
    connect: (addr: string) => any,
    buttonProps?: ButtonProps
}) => (<ButtonGroup>
        {
          knownAddresses.map((addr) => <Tooltip
          key={`connect-${addr.address}`}
          label={addr.address}
          aria-label={addr.address}
          placement="bottom"
        >
          <Button
            variantColor="teal"
            size="sm"
            {...buttonProps}
            onClick={() => connect(addr.address)}>
              {addr.name}
          </Button>
        </Tooltip>)
        }
      </ButtonGroup>);

export default IPFSConnectKnownAddress;
