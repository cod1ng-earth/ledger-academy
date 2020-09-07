import { IPFS } from 'ipfs';
import React, { useState } from 'react';
import { useIPFS } from './context/IPFS';

const IpfsPage: React.FC = () => {
  const ipfs = useIPFS();

  const [files, setFiles] = useState<IPFS.IPFSFile[]>([]);

  async function addToIpfs(content: string | any[]): Promise<any[]> {
    if (!ipfs) { return []; }

    const addResult = await ipfs.add(content);
    const results = [];

    for await (const result of addResult) {
      results.push(result);
    }
    return results;
  }

  const submit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const currentContent = e.target.thecontent.value;
    const ipfsResult = await addToIpfs(currentContent);
    console.log(ipfsResult);

    setFiles([...files, ipfsResult[0]]);
  };

  return (
    <div>
      <form onSubmit={submit}>
        <textarea name="thecontent">test</textarea>
        <button type="submit" value="store!">
          store!
        </button>
      </form>
      <h2>Files:</h2>
      <ul>
        {files.map((f) => (
          <li key={f.cid.toString()}>
            <a
              href={`https://ipfs.io/ipfs/${f.cid.toString()}`}
              rel="noreferrer"
              target="_blank"
            >
              {f.cid.toString()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IpfsPage;
