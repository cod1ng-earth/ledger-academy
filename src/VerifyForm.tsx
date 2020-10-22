import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import VerifierABI  from "./contracts/Verifier.json";

import _secrets from "../.secrets.json";

const VerifyForm = () => {
  const { library: web3, account } = useWeb3React<Web3>();
  const [message, setMessage] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [localVerificationResult, setLocalVerificationResult] = useState<string>("");
  const [contractVerificationResult, setContractVerificationResult] = useState<string>("");
  const [nonEthSignatureVerificationResult, setNonEthSignatureVerificationResult] = useState<string>("");

  const contract = new web3.eth.Contract(
    VerifierABI.abi,
    _secrets.verifierContractAddress
  );

  // this will only work with messages that have been a hash by itself ;)
  async function verifyNonEthSignatureOnContract() {
    const nonEthMessageHash = web3.utils.sha3(message); 
    const recovered = await contract.methods.recoverAddrFromNonEthHash(
      nonEthMessageHash,
      signature
    ).call()

    console.log(recovered);
    setNonEthSignatureVerificationResult(recovered);
  }

  async function verifySignatureOnContract() {
    const verifiableMessage = `\x19Ethereum Signed Message:\n${message.length}${message}`;
    const verifiableMessageSha = web3.utils.sha3(verifiableMessage); 
    
    const recovered = await contract.methods.recoverAddr(
      verifiableMessageSha,
      signature
    ).call()

    console.log(recovered);
    setContractVerificationResult(recovered);
  }

  async function verifySignatureLocally() {
    const recovered = await web3.eth.personal.ecRecover(message, signature);
    console.log(recovered);
    setLocalVerificationResult(web3.utils.toChecksumAddress(recovered));
  }

  async function verifySignature() {
    verifySignatureLocally();
    verifySignatureOnContract();
    verifyNonEthSignatureOnContract();
  }

  function eqAccount(addr: string) {
    return addr === account
  }
  return (
    <div>
      <label>Message</label>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <label>Signature</label>
      <input
        type="text"
        value={signature}
        onChange={(e) => setSignature(e.target.value)}
      />

      <button disabled={!message} onClick={verifySignature}>
        Verify!
      </button>
      
      <br />

      { localVerificationResult && 
        <small style={{color: eqAccount(localVerificationResult) ? 'green':'red'}}>
          local verification: {localVerificationResult}
          <br />
        </small>
      }
      { contractVerificationResult && 
        <small style={{color: eqAccount(contractVerificationResult) ? 'green':'red'}}>
          contract verification: {contractVerificationResult} <br />
        </small>
      }
      { nonEthSignatureVerificationResult && 
        <small style={{color: eqAccount(nonEthSignatureVerificationResult) ? 'green':'red'}}>
          non eth signed verification: {nonEthSignatureVerificationResult}
        </small>
      }
        
    </div>
  );
};

export default VerifyForm;
