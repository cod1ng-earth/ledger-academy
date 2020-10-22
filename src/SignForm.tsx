import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

const SignForm = () => {
  const { account, library: web3 } = useWeb3React<Web3>();
  const [message, setMessage] = useState<string>("");

  const [signature, setSignature] = useState<string>("");

  async function signMessage() {
    const signed = await web3.eth.personal.sign(message, account, "")
    setSignature(signed);
  }

  return (
    <div>
          <label htmlFor="address">Message</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button disabled={!message} onClick={signMessage}>
            Sign!
          </button>
          <br />
          {signature && 
          <small><b>Signature: {signature}</b></small>
          }
        
    </div>
  );
};

export default SignForm;
