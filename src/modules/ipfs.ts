import Multiaddr from 'multiaddr';

export interface Mtime {
  secs: number;
  nsecs?: number;
}

export interface Id {
  id: string;
  protocolVersion: string;
  publicKey: string;
  addresses: Multiaddr[];
  agentVersion: string;
}

export interface PeerInfo {
  id: string;
  addrs: Multiaddr[];
}

export interface Peer {
  addr: Multiaddr;
  peer: string;
}
