import {
  Box, Flex, Heading, Text,
} from '@chakra-ui/core';
import OneLineTextInput, { InputBase } from 'components/atoms/InputFlex';
import NewMessageForm from 'components/atoms/NewMessageForm';
import PubsubMessageDisplay from 'components/molecules/storage/PubsubMessageDisplay';
import PubsubPeers from 'components/molecules/storage/PubsubPeers';
import React, { useCallback, useState } from 'react';
import IPFSSwarmAddressAlert from 'components/molecules/storage/IPFSSwarmAddressAlert';
import { useIPFS } from '../../../context/IPFS';

// interface IIpfsPubSubInterface {
//   onTopic?: (topic: string) => void;
// }

const textDecoder = new TextDecoder('utf-8');

const IpfsPubSub = () => {
  const [topic, setTopic] = useState<string>('');

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

    <IPFSSwarmAddressAlert />

    <Heading as="h2" size="md" my="2">Publish - Subscribe</Heading>

    <InputBase>
      <OneLineTextInput
        onSubmit={subscribe}
        label="topic"
        placeholder="subscribe to topic updates"
        submitLabel="subscribe"
      />
    </InputBase>
    {topic && <Heading size="md">Subscribed to {topic}</Heading>}
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
