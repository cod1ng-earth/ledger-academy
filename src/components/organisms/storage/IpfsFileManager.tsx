import {
  Box, Button, Flex, Heading, IconButton, List, SimpleGrid, Textarea,
} from '@chakra-ui/core';
import DownloadFile from 'components/molecules/storage/DownloadFile';
import DropZone from 'components/molecules/storage/DropZone';
import FileListItem from 'components/molecules/storage/FileListItem';
import { Ipfs } from 'ipfs';
import React, { useCallback, useEffect, useState } from 'react';
import { useIPFS } from '../../../context/IPFS';
import { ArweaveWallet } from './ArweaveTab';

interface ArweaveProps {
  arweave: any;
  arweaveWallet: ArweaveWallet | undefined;
}

const IpfsFileManager = ({ arweave, arweaveWallet }: ArweaveProps) => {
  const { ipfsNode } = useIPFS();
  const [files, setFiles] = useState<Ipfs.UnixFSLsResult[]>([]);
  const [folderCid, setFolderCid] = useState<string>('');

  const FOLDER_NAME = '/dropzone';

  async function addData(fileName: string, data: ArrayBuffer | string | null): Promise<void> {
    return ipfsNode!.files.write(`${FOLDER_NAME}/${fileName}`, data, {
      create: true, parents: true,
    });
  }

  const refreshDirectory = useCallback(async () => {
    try {
      if (!ipfsNode) return;

      let stats;
      try {
        stats = await ipfsNode.files.stat(FOLDER_NAME);
      } catch (e) {
        ipfsNode.files.mkdir(FOLDER_NAME);
        stats = await ipfsNode.files.stat(FOLDER_NAME);
      }

      setFolderCid(stats.cid.toString());

      const res = ipfsNode.files.ls(FOLDER_NAME);
      const _files = [];
      for await (const file of res) {
        _files.push(file);
      }
      setFiles(_files);
    } catch (e) {
      console.error(e);
    }
  }, [ipfsNode]);

  const submitText = async (e: any) => {
    if (!ipfsNode) {
      return false;
    }
    e.preventDefault();
    e.stopPropagation();
    const _currentContent = e.target.thecontent.value;
    const fileName = `${(new Date()).toISOString()}.txt`;

    await addData(fileName, _currentContent);
    refreshDirectory();
  };

  useEffect(() => {
    if (ipfsNode) { refreshDirectory(); }
  }, [ipfsNode, refreshDirectory]);

  return (<Flex direction="column" >
    <Box p="2" bg="gray.200" my="2">
      <Heading as="h2" size="md" my="2">Add anything to IPFS</Heading>
      <SimpleGrid columns={[1, 2]} spacing="2" >
        <Box w="100%">
          <form onSubmit={submitText}>
            <Textarea name="thecontent" defaultValue="test" />
            <Button variantColor="red" type="submit" mt="1">
              store!
              </Button>
          </form>
        </Box>
        <Flex >
          <DropZone addData={addData} onUpdated={refreshDirectory} />
        </Flex>
      </SimpleGrid>
    </Box>

    <Box>
      <Heading as="h2" size="md" my="2">Download anything</Heading>
      <DownloadFile />
    </Box>

    <Box>
      <Flex justify="space-between" mt="2">
        <Heading as="h2" size="md" my="2">Uploaded so far</Heading>
        <IconButton as="a" {...{ target: '_blank', href: `https://ipfs.io/ipfs/${folderCid}` }} icon="external-link" aria-label="show on gateway" />
      </Flex>
      <List>
        {files.map((f) => <FileListItem file={f} key={`${f.cid.toString()}`} arweave={arweave} arweaveWallet={arweaveWallet} />)}
      </List>
    </Box>

  </Flex>);
};

export default IpfsFileManager;
