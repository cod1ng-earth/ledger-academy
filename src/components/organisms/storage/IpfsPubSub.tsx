import {
  Box, Button, Flex, Heading, Input, InputGroup, InputRightElement, Text,
} from '@chakra-ui/core';
import NewMessageForm from 'components/atoms/NewMessageForm';
import PubsubMessageDisplay from 'components/molecules/storage/PubsubMessageDisplay';
import PubsubPeers from 'components/molecules/storage/PubsubPeers';
import React, { useCallback, useState } from 'react';
import { useIPFS } from '../../../context/IPFS';

interface IIpfsPubSubInterface {
  onTopic?: (topic: string) => void;
}

const textDecoder = new TextDecoder('utf-8');

const IpfsPubSub = (props: IIpfsPubSubInterface) => {
  const [topic, setTopic] = useState<string>('');
  const [newTopic, setNewTopic] = useState<string>(' ');

  const [messages, setMessages] = useState<any[]>([]);
  const { ipfsNode } = useIPFS();

  async function publish(_message: string): Promise<void> {
    return ipfsNode?.pubsub.publish(topic, _message);
  }

  function decodeMessageToUtf8(_message: any): object {
    return {
      data: textDecoder.decode(_message.data),
      from: _message.from,
    };
  }

  const handleNewMessage = useCallback((newMessage) => {
    console.log(newMessage);
    setMessages((prevMessages) => [
      decodeMessageToUtf8(newMessage),
      ...prevMessages,
    ]);
  }, []);

  async function subscribe(_topic: string): Promise<void> {
    if (topic) {
      ipfsNode!.pubsub.unsubscribe(topic);
    }
    setTopic(_topic);
    setMessages([]);
    ipfsNode!.pubsub.subscribe(_topic, handleNewMessage, {
      onError: (err: any) => {
        console.error(err);
      },
    });
  }

  return (<Flex direction="column" >
    <Heading as="h2" size="md" my="2">Publish - Subscribe</Heading>
    <Box p="2" bg="gray.200">
      <form onSubmit={(e) => { e.preventDefault(); subscribe(newTopic); }}>
        <InputGroup size="md">
          <Input
            name="topic"
            onChange={(e: any) => setNewTopic(e.target.value)} value={newTopic}
            type="text"
            placeholder="topic"
          />
          <InputRightElement width="6.5rem">
            <Button h="1.75rem" size="sm" type="submit">
              subscribe
            </Button>
          </InputRightElement>
        </InputGroup>
      </form>
    </Box>
    {messages.map((msg, i) => <Box p={2} key={`msg-${msg.from}-${i}`}>
      <Text as="b">{msg.from}.{i}</Text>
      <PubsubMessageDisplay data={msg.data} />
    </Box>)}
    {topic && <NewMessageForm onSubmitted={publish} />}
    {topic && <PubsubPeers topic={topic} />}
  </Flex>
  );
};

export default IpfsPubSub;
