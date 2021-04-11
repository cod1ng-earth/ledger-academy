import fetch from 'cross-fetch';
import { useEffect, useState } from 'react';
import CID from 'cids';

export interface IPinningServiceConfiguration {
  url: string;
  token: string;
}

export interface PinningApi {
  pin: (cid: CID) => Promise<any>;
  checkPin: (cid: CID) => Promise<any>;
}

interface PinResult {
  date_pinned: string;
  date_upinned: string;
  metadata: any;
  id: string;
  ipfs_pin_hash: string;
  regions: any[];
  size: number;

}

export interface CheckPinResult {
  count: number;
  rows: PinResult[];
}

export const usePinningService = () => {
  const [
    pinningServiceConfiguration,
    setPinningServiceConfiguration,
  ] = useState<IPinningServiceConfiguration>({
    url: process.env.REACT_APP_PINATA_URL || '',
    token: process.env.REACT_APP_PINATA_API_JWT || ''
  });

  useEffect(() => {
    const storedConfig = localStorage.getItem('pin_config');
    if (storedConfig) {
      const parsed = JSON.parse(storedConfig);
      setPinningServiceConfiguration(parsed as IPinningServiceConfiguration);
    }
  }, []);

  const updatePinningServiceConfiguration = (newConfig: IPinningServiceConfiguration) => {
    localStorage.setItem('pin_config', JSON.stringify(newConfig));
    setPinningServiceConfiguration(newConfig);
  };

  const request = async (method: string, endpoint: string, body?: any): Promise<any> => {
    const url = `${pinningServiceConfiguration.url}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pinningServiceConfiguration.token}`,
      },
      body,
      redirect: 'follow'
    });

    if (response.status >= 400) {
      throw new Error('Bad response');
    }

    return response.json();
  };

  const pin =  async (cid: CID): Promise<any> => {
    request('POST', `/pinning/pinByHash`,
    JSON.stringify({
      hashToPin: cid.toV0().toString(),
      pinataMetadata: {
        keyvalues: {
          origin: "ledger-academy"   
        }
      }
    })
    );
  }

  const checkPin = async (cid: CID): Promise<CheckPinResult> => {
    return request(
      'GET', `/data/pinList?hashContains=${cid.toV0().toString()}`,
    )
  }

  return {
    pin,
    checkPin,
    pinningServiceConfiguration,
    updatePinningServiceConfiguration,
  };
};

export default usePinningService;
