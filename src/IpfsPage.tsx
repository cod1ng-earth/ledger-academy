import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import DocExchange from "./contracts/DocExchange.json";

import IPFS, { Buffer, CID } from "ipfs";
import _secrets from "../.secrets.json";

const IpfsPage: React.FC = () => {
  const { account, library: web3 } = useWeb3React<Web3>();
  const [ipfsNode, setIpfsNode] = useState();

  const [files, setFiles] = useState([]);
  const [myDocumentContent, setMyDocumentContent] = useState();

  const contract = new web3.eth.Contract(
    DocExchange.abi,
    _secrets.docExchangeAddress
  );

  async function anchorOnChain(cid) {
    const bytes = [...cid.buffer];

    const promiEvent = contract.methods.addDocument(bytes).send({
      from: account,
      gasPrice: 21 * 1e5,
      gas: 30 * 1e5,
    });

    promiEvent.on("transactionHash", console.log);
    promiEvent.on("receipt", console.log);
    promiEvent.on("confirmation", (number, confirmation) => {
      console.debug(confirmation);
    });
  }

  async function getMyDocumentFromChainAndResolve() {
    const resultBytes = await contract.methods.getMyDocument().call({
      from: account,
    });
    console.log("cid stored on chain", resultBytes);

    const bytes = Web3.utils.hexToBytes(resultBytes);
    const cid = new CID(Buffer.from(bytes));
    console.log("CID recovered from contract", cid.toString());

    const contentChunks = await ipfsNode!.cat(cid);
    const awaitedChunks: any[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of contentChunks) {
      awaitedChunks.push(chunk);
    }
    const result = Buffer.concat(awaitedChunks).toString();
    console.log("content: ", result);
    setMyDocumentContent(result);
    return result;
  }

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

    anchorOnChain(ipfsResult[0].cid);

    setFiles([...files, ipfsResult[0]]);
  };

  useEffect(() => {
    (async () => {
      const _ipfsNode = await IPFS.create();
      console.log("ipfs node is running");
      setIpfsNode(_ipfsNode);
    })();
  }, []);

  return (
    <div>
      <form onSubmit={submit}>
        <textarea
          name="thecontent"
          rows={10}
          cols={40}
          defaultValue="type anything you'd like to store forever..."
        ></textarea>{" "}
        <br />
        <button type="submit" value="store!">
          store forever!
        </button>
      </form>
      <h2>History:</h2>
      <ul>
        {files.map((f) => (
          <li>
            <a
              href={`https://ipfs.io/ipfs/${f.cid.toString()}`}
              target="_blank"
            >
              {f.cid.toString()}
            </a>
          </li>
        ))}
      </ul>
      <h2>My Document:</h2>
      <button onClick={getMyDocumentFromChainAndResolve}>
        get my document.
      </button>
      <p>{myDocumentContent}</p>
    </div>
  );
};

export default IpfsPage;
