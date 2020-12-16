/* eslint-disable import/prefer-default-export */
import fetch from "cross-fetch";
import { encode } from "base-64";

const requestPinServer = (method: string, url: string) => {
  return fetch(url, {
    method: method,
    headers: {
      'Authorization': `Basic ${encode(process.env.REACT_APP_PIN_SERVICE_AUTH_USER + ':' + process.env.REACT_APP_PIN_SERVICE_AUTH_PASSWORD)}`,
    },
    redirect: 'follow',
  });
};

export const pin = async (cid: string) => {
  try {
    const response = await requestPinServer(
      'POST', process.env.REACT_APP_PIN_SERVICE_HOST + '/pins/' + cid
    );

    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }

    const result = await response.json();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
};

export const checkPinStatus = async (cid: string) => {
  try {
    const response = await requestPinServer(
      'GET', process.env.REACT_APP_PIN_SERVICE_HOST + '/pins/' + cid
    );

    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
