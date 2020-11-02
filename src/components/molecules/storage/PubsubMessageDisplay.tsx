import React, { useState, useEffect } from 'react';
import { useIPFS } from 'context/IPFS';

export default function PubsubMessageDisplay({ data }: {data: string}) {
  const [binaryUrl, setBinaryUrl] = useState<string>();
  const { ipfsNode } = useIPFS();

  function isCid(_data: string) {
    return _data.startsWith('Qm');
  }

  useEffect(() => {
    if (!isCid(data)) {
      return;
    }
    try {
      (async () => {
        const res = await ipfsNode?.files.read(`/ipfs/${data}`);
        const chunks = [];
        for await (const r of res) {
          chunks.push(r);
        }
        const blob = new Blob(chunks, { type: 'image/jpg' });

        const url = window.URL.createObjectURL(blob);
        setBinaryUrl(url);
      })();
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (<div>
      <p>{data}</p>
      {binaryUrl && <img src={binaryUrl} alt="binary" /> }
    </div>);
}
