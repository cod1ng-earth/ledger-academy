import {
  Box, Button, Flex, Heading, Input, InputGroup, InputRightElement, Text,
} from '@chakra-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useIPFS } from '../../../context/IPFS';

interface IIpfsPubSubInterface {
  onTopic: (topic: string) => void;
}

interface MessageDisplayProps {
  data: string;
}

function MessageDisplay({ data }: MessageDisplayProps) {
  const [binaryUrl, setBinaryUrl] = useState<string>();
  const { ipfsNode } = useIPFS();

  function isCid(_data: string) {
    return _data.startsWith('Qm');
  }

  useEffect(() => {
    if (!isCid(data)) {
      return;
    }
    try {
      (async () => {
        const res = await ipfsNode?.files.read(`/ipfs/${data}`);
        const chunks = [];
        for await (const r of res) {
          chunks.push(r);
        }
        const blob = new Blob(chunks, { type: 'image/jpg' });

        const url = window.URL.createObjectURL(blob);
        setBinaryUrl(url);
      })();
    } catch (e) {
      console.error(e);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (<div>
    <p>{data}</p>
    {binaryUrl && <img src={binaryUrl} alt="binary" /> }
  </div>);
}

const NewMessage = ({ onSubmitted }: {onSubmitted: Function}) => {
  const [message, setMessage] = useState<string>('');

  function onSubmit(e: any) {
    e.preventDefault();
    onSubmitted(message);
    setMessage('');
  }

  return <form onSubmit={onSubmit}>
     <InputGroup size="md">
     <Input
          name="Message"
          onChange={(e: any) => setMessage(e.target.value)} value={message}
          type="text"
          placeholder="New Message"
        />
          <InputRightElement width="6.5rem">
            <Button h="1.75rem" size="sm" type="submit">
            send
            </Button>
          </InputRightElement>
        </InputGroup>
    </form>;
};

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
  }, [topic]);

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
            <MessageDisplay data={msg.data} />
    </Box>)}
    {topic && <NewMessage onSubmitted={publish} /> }
  </Flex>
  );
};

export default IpfsPubSub;
