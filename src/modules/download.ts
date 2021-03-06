import CID from 'cids';
import { IPFS } from 'ipfs-core';
import uint8ArrayConcat from 'uint8arrays/concat';

export const download = async ({ ipfsNode, cid, fileName }: {
    ipfsNode: IPFS, cid: CID, fileName?: string
  }) => {
  const res = ipfsNode.get(cid);
  for await (const f of res) {
    const chunks = [];
    if (f.type === 'file') {
      for await (const chunk of f.content!) {
        chunks.push(chunk);
      }
      const all = uint8ArrayConcat(chunks);
      const blob = new Blob([all], { type: 'application/binary' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName || 'download.bin';
      link.click();
    }
  }
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
