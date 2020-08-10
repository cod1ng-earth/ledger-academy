import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

const VerifyForm = () => {
  const { library: web3 } = useWeb3React<Web3>();
  const [message, setMessage] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [pubAddress, setPubAddress] = useState<string>("");

  async function verifyMessage() {
    const recovered = await web3.eth.personal.ecRecover(message, signature);
    setPubAddress(recovered);
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

          <button disabled={!message} onClick={verifyMessage}>
            Verify!
          </button>
          <br />
          { pubAddress && 
            <small>public address of the signer: {pubAddress}</small>
          }
        
    </div>
  );
};

export default VerifyForm;
