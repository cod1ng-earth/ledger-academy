import fetch from 'cross-fetch';
import { encode } from 'base-64';

export interface IPinningServiceConfiguration {
  url: string,
  username: string | null,
  password: string | null
}

export interface PinningApi {
  pin: (cid: string) => Promise<any>,
  checkPin: (cid: string) => Promise<any>,
}

const usePinning = (config : IPinningServiceConfiguration): PinningApi => {
  const credentials = encode(`${config.username}:${config.password}`);

  const request = async (method: string, endpoint: string): Promise<any> => {
    const url = `${config.url}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      redirect: 'follow',
    });

    if (response.status >= 400) {
      console.error(response);
      throw new Error('Bad response');
    }

    return response.json();
  };

  return {
    pin: async (cid: string): Promise<any> => request(
      'POST', `/pins/${cid}`,
    ),
    checkPin: async (cid: string): Promise<any> => request(
      'GET', `/pins/${cid}`,
    ),
  };
};

export default usePinning;
