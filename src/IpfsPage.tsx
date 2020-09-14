import React, { useState, useEffect } from "react";

import {Ipfs, IpfsFile, create as createNode} from "ipfs";
import _secrets from "../.secrets.json";

const IpfsPage: React.FC = () => {
  const [ipfsNode, setIpfsNode] = useState<Ipfs>();

  const [files, setFiles] = useState([]);

  async function addToIpfs(content: string | any[]): Promise<any[]> {
    const addResult = ipfsNode!.add(content);
    const results = [];

    for await (const result of addResult) {
      results.push(result);
    }
    return results;
  }

  const submit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const _currentContent = e.target["thecontent"].value;
    const ipfsResult = await addToIpfs(_currentContent);
    console.log(ipfsResult);

    setFiles([...files, ipfsResult[0]]);
  };

  useEffect(() => {
    (async () => {
      const _ipfsNode = await createNode();
      console.log("ipfs node is running");
      setIpfsNode(_ipfsNode);
    })();
  }, []);

  return (
    <div>
      <form onSubmit={submit}>
        <textarea name="thecontent" defaultValue="test" />
        <button type="submit" value="store!">
          store!
        </button>
      </form>
      <h2>Files:</h2>
      <ul>
        {files.map((f: IpfsFile) => (
          <li key={f.cid.toString()}>
            <a
              href={`https://ipfs.io/ipfs/${f.cid.toString()}`}
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
