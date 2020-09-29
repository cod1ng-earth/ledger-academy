/* eslint-disable react/jsx-no-target-blank */
import React, { useState } from "react";

import { Ipfs } from "ipfs";
import PubSub from "../organisms/PubSub";
import { useIPFS } from '../../context/IPFS';
import { RouteComponentProps } from "@reach/router";

const IpfsPage = (props: RouteComponentProps) => {
  const {ipfsNode} = useIPFS();

  const [topic, setTopic] = useState<string>();
  const [files, setFiles] = useState<Ipfs.UnixFSEntry[]>([]);

  const submit = async (e: any) => {
    if (!ipfsNode) {
      return false;
    }
    e.preventDefault();
    e.stopPropagation();
    const _currentContent = e.target["thecontent"].value;
    const ipfsResults = ipfsNode.add(_currentContent);
    const flatResults = [];
    for await (const result of ipfsResults) {
      flatResults.push(result)
    }
    if (flatResults) {
      setFiles([...files, ...flatResults ]);
    }
  };

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
        {files.map((f) => (
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

      {ipfsNode && <div>
          <h1>Pubsub {topic}</h1>
          <PubSub onTopic={setTopic} />
        </div>
      }
    </div>
  );
};

export default IpfsPage;
