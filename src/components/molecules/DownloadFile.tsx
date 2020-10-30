import React, { useState } from 'react';
import { useIPFS } from 'context/IPFS';
import { CID } from 'ipfs';
import { download } from 'modules/download';
import {
  InputGroup, Input, InputRightElement, Button,
} from '@chakra-ui/core';

const DownloadFile = () => {
  const { ipfsNode } = useIPFS();
  const [sCid, setSCid] = useState<string>('');

  const initiateDownload = () => {
    if (!ipfsNode) return;

    const cid = new CID(sCid);
    download({ ipfsNode, cid });
  };

  return (<form onSubmit={(e) => { e.preventDefault(); initiateDownload(); }}>
      <InputGroup size="md">
        <Input
          name="cid"
          onChange={(e: any) => setSCid(e.target.value)} value={sCid}
          type="text"
          placeholder="CID"
        />
        <InputRightElement width="6.5rem">
          <Button h="1.75rem" size="sm" type="submit">
          download
          </Button>
        </InputRightElement>
      </InputGroup>
    </form>);
};

export default DownloadFile;
