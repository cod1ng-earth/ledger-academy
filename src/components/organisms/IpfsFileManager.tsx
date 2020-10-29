import {
  Box, Button, Flex, Heading, Link, List, ListItem, Textarea,
} from '@chakra-ui/core';
import DropZone from 'components/molecules/DropZone';
import { Ipfs } from 'ipfs';
import React, { useEffect, useState } from 'react';
import { useIPFS } from '../../context/IPFS';

const IpfsFileManager = () => {
  const { ipfsNode } = useIPFS();

  const [topic, setTopic] = useState<string>();
  const [files, setFiles] = useState<Ipfs.UnixFSLsResult[]>([]);

  const FOLDER_NAME = '/dropzone';

  async function addData(fileName: string, data: ArrayBuffer | string | null): Promise<void> {
    return ipfsNode!.files.write(`${FOLDER_NAME}/${fileName}`, data, {
      create: true, parents: true,
    });
  }

  const refreshDirectory = async () => {
    try {
      if (!ipfsNode) return;

      const stats = await ipfsNode.files.stat(FOLDER_NAME);
      console.log(stats);

      const res = ipfsNode.files.ls(FOLDER_NAME);
      const _files = [];
      for await (const file of res) {
        _files.push(file);
      }
      console.log(_files);
      setFiles(_files);
    } catch (e) {
      console.error(e);
    }
  };

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

  async function loadFile(path: string) {
    const res = ipfsNode!.files.read(path);
    for await (const r of res) {
      console.log(r);
    }
  }

  useEffect(() => {
    if (ipfsNode) { refreshDirectory(); }
  }, [ipfsNode]);

  return (<Flex direction="column" >
    <Box p="2" bg="gray.200">
      <Heading as="h2" size="md" my="2">Add anything to IPFS</Heading>
      <Flex direction="row" gridGap="2">
        <Box width={{ base: 1, sm: 1 / 2 }}>
          <form onSubmit={submitText}>
              <Textarea name="thecontent" defaultValue="test" />
              <Button variantColor="red" type="submit">
                store!
              </Button>
          </form>
        </Box>
        <Box width={{ base: 1, sm: 1 / 2 }}>
          <DropZone addData={addData} onUpdated={refreshDirectory} />
        </Box>
      </Flex>

    </Box>
    <Box>
      <Heading as="h2" size="md" my="2">Uploaded so far:</Heading>
      <List>
        {files.map((f) => (
          <ListItem key={f.cid.toString()} p="3" bg="gray.200">

            <Link
              fontWeight="bold"
              href={`https://ipfs.io/ipfs/${f.cid.toString()}`}
              target="_blank"
            >
              {f.name}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>

  </Flex>);
};

export default IpfsFileManager;
