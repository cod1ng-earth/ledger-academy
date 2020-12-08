/* eslint-disable import/prefer-default-export */
import fetch from "cross-fetch";

export const pin = async (cid: string) => {
  try {
    const response = await fetch(process.env.REACT_APP_PIN_SERVICE_HOST + '/pins/' + cid, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${process.env.REACT_APP_PIN_SERVICE_AUTHORIZATION}`,
      },
      redirect: 'follow',
    });

    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }

    const result = await response.json();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
};

export const checkPin = async (cid: string) => {
  try {
    const response = await fetch(process.env.REACT_APP_PIN_SERVICE_HOST + '/pins/' + cid, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${process.env.REACT_APP_PIN_SERVICE_AUTHORIZATION}`,
      },
      redirect: 'follow',
    });

    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
