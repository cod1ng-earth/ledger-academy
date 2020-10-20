/* eslint-disable react/jsx-no-target-blank */
import {
  Box, Button, Flex, Heading, Link, List, ListItem, Textarea,
} from '@chakra-ui/core';
import FileManager from 'components/organisms/FileManager';
import { Ipfs } from 'ipfs';
import React, { useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useIPFS } from '../../context/IPFS';
import PubSub from '../organisms/PubSub';

const IpfsPage = (props: RouteComponentProps) => {
  const { ipfsNode } = useIPFS();

  const [topic, setTopic] = useState<string>();
  const [files, setFiles] = useState<Ipfs.UnixFSEntry[]>([]);

  const submit = async (e: any) => {
    if (!ipfsNode) {
      return false;
    }
    e.preventDefault();
    e.stopPropagation();
    const _currentContent = e.target.thecontent.value;
    const ipfsResults = ipfsNode.add(_currentContent);
    const flatResults = [];
    for await (const result of ipfsResults) {
      flatResults.push(result);
    }
    if (flatResults) {
      setFiles([...files, ...flatResults]);
    }
    return true;
  };

  return (
    <Flex direction="column">
      <Heading as="h2" size="md">Add anything to IPFS</Heading>
        <Box>
          <form onSubmit={submit}>
            <Textarea name="thecontent" defaultValue="test" />
            <Button variantColor="red" type="submit">
              store!
            </Button>
          </form>
          <FileManager />
        </Box>
      <Heading as="h2" size="md">Uploaded so far:</Heading>
      <List>
        {files.map((f) => (
          <ListItem key={f.cid.toString()}>
            <Link
              href={`https://ipfs.io/ipfs/${f.cid.toString()}`}
              target="_blank"
            >
              {f.cid.toString()}
            </Link>
          </ListItem>
        ))}
      </List>
      {ipfsNode && <div>
        <h1>Pubsub {topic}</h1>
        <PubSub onTopic={setTopic} />
      </div>
}
    </Flex>

  );
};

export default IpfsPage;
