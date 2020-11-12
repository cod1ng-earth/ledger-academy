/* eslint-disable import/prefer-default-export */

import { Ipfs, CID } from 'ipfs';
import uint8ArrayConcat from 'uint8arrays/concat';

export const download = async ({ ipfsNode, cid, fileName }: {
    ipfsNode: Ipfs, cid: CID, fileName?: string
  }) => {
  const res = ipfsNode.get(cid);
  for await (const f of res) {
    const chunks = [];
    for await (const chunk of f.content) {
      chunks.push(chunk);
    }
    const all = uint8ArrayConcat(chunks);
    const blob = new Blob([all], { type: 'application/binary' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName || 'download.bin';
    link.click();
  }
};

export const downloadFromArweave = async ({ arweave, transactionId }: {
  arweave: any, transactionId: string
}) => {
  const data = await arweave.transactions.getData(transactionId, {decode: true, string: true});
  const blob = new Blob([data], { type: 'application/binary' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'arweave-download.txt';
  link.click();
};

export const content = async ({ ipfsNode, cid }: {
    ipfsNode: any, cid: CID
  }) => {
  const results = ipfsNode.cat(cid);
  const chunks = [];
  for await (const chunk of results) {
    chunks.push(chunk);
  }
  return uint8ArrayConcat(chunks);
};
