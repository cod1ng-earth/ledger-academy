import React, { useState } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import {
  Box, FormControl, FormLabel, Input, FormHelperText, Button, Flex, Alert, Text,
} from '@chakra-ui/core';
import VerifierABI from '../../contracts/Verifier.json';

const VerificationResult = ({ label, result, resultText }: {
  label: string,
  result: boolean,
  resultText: string
}) => <Alert status={result ? 'success' : 'error'}>
  <Box mr="2">
    <Text>{label}: {resultText}</Text>
  </Box>
</Alert>;

const VerifyForm = ({ web3, account }: {web3: Web3, account: string}) => {
  const [message, setMessage] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [localVerificationResult, setLocalVerificationResult] = useState<string>('');
  const [contractVerificationResult, setContractVerificationResult] = useState<string>('');
  const [nonEthSignatureVerificationResult, setNonEthSignatureVerificationResult] = useState<string>('');

  const contract = new web3.eth.Contract(
    VerifierABI.abi as AbiItem[],
    process.env.REACT_APP_CONTRACT_ADDRESS_VERIFIER,
  );

  // this will only work with messages that have been a hash by itself ;)
  async function verifyNonEthSignatureOnContract() {
    const nonEthMessageHash = web3.utils.sha3(message);
    const recovered = await contract.methods.recoverAddrFromNonEthHash(
      nonEthMessageHash,
      signature,
    ).call();

    setNonEthSignatureVerificationResult(recovered);
  }

  async function verifySignatureOnContract() {
    const verifiableMessage = `\x19Ethereum Signed Message:\n${message.length}${message}`;
    const verifiableMessageSha = web3.utils.sha3(verifiableMessage);

    const recovered = await contract.methods.recoverAddr(
      verifiableMessageSha,
      signature,
    ).call();

    setContractVerificationResult(recovered);
  }

  async function verifySignatureLocally() {
    const recovered = await web3.eth.personal.ecRecover(message, signature);
    setLocalVerificationResult(web3.utils.toChecksumAddress(recovered));
  }

  async function verifySignature() {
    verifySignatureLocally();
    verifySignatureOnContract();
    verifyNonEthSignatureOnContract();
  }

  function eqAccount(addr: string) {
    return addr === account;
  }
  return (
    <Flex direction="column">
      <Box>
        <FormControl>
          <FormLabel htmlFor="message">Message</FormLabel>
          <Input
            type="text"
            value={message}
            name="message"
            onChange={(e: any) => setMessage(e.target.value)}
          />
          <FormHelperText>
            the message to sign
          </FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="signature">Signature</FormLabel>
          <Input
            type="text"
            value={signature}
            name="signature"
            onChange={(e: any) => setSignature(e.target.value)}
          />
          <FormHelperText>
            the message to sign
          </FormHelperText>
        </FormControl>

        <Button variantColor="teal" isDisabled={!message} onClick={verifySignature}>Verify</Button>
      </Box>

      <Box>

        { localVerificationResult
          && <VerificationResult label="local verification"
          result={eqAccount(localVerificationResult)}
          resultText={localVerificationResult} />
        }

        { contractVerificationResult
          && <VerificationResult label="on chain verification"
          result={eqAccount(contractVerificationResult)}
          resultText={contractVerificationResult} />
        }

        { nonEthSignatureVerificationResult
          && <VerificationResult label="local verification"
          result={eqAccount(nonEthSignatureVerificationResult)}
          resultText={nonEthSignatureVerificationResult} />
        }

      </Box>
  </Flex>
  );
};

export default VerifyForm;
