import OneLineTextInput from 'components/atoms/InputFlex';
import { useIPFS } from 'context/IPFS';
import { CID } from 'ipfs';
import { download } from 'modules/download';
import React from 'react';

const DownloadFile = () => {
  const { ipfsNode } = useIPFS();

  const initiateDownload = (sCid: string) => {
    if (!ipfsNode) return;

    const cid = new CID(sCid);
    download({ ipfsNode, cid });
  };

  return (
  <OneLineTextInput
    label="Download"
    onSubmit={initiateDownload}
    submitLabel="download"
    placeholder="QmCid"
  />);
};

export default DownloadFile;
