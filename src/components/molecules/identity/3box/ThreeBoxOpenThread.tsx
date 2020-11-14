import * as TBox from '3box';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button, Flex, IconButton, Input, InputGroup, InputRightElement, Text, useClipboard,
} from '@chakra-ui/core';
import { InputBase } from 'components/atoms/InputFlex';
import NewMessageForm from 'components/atoms/NewMessageForm';
import { useIPFS } from 'context/IPFS';
import React, { useEffect, useState } from 'react';

export const OPEN_THREAD_NAME = 'ledger-academy-open-thread';

export type ThreeId = string;

export interface ThreadPost {
  postId: string;
  message: string;
  author: ThreeId;
  timestamp: number;
}

const JoinThread = ({ joinThread }: { joinThread: (thread: string) => any }) => {
  const [thread, setThread] = useState<string>('');
  return <InputBase >
    <InputGroup size="md" w="100%">
      <Input
        name="thread"
        onChange={(e: any) => setThread(e.target.value)} value={thread}
        type="text"
        placeholder="Thread Address"
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={() => {
          joinThread(thread);
          setThread('');
        }}>
          join
        </Button>
      </InputRightElement>
    </InputGroup>
  </InputBase>;
};

const ThreadMessageDisplay = ({ post }: { post: ThreadPost }) => {
  const [userName, setUserName] = useState<string>(post.author);
  const { ipfsNode } = useIPFS();

  useEffect(() => {
    (async () => {
      const profile = await TBox.getProfile(post.author, {
        ipfs: ipfsNode,
        useCacheService: false,
      });
      setUserName(profile.name);
    })();
  }, []);

  return <Box py={2}>
    <Text as="b">{userName}</Text>
    <Text>{post.message}</Text>
  </Box>;
};

const ThreeBoxOpenThread = ({ space }: { space: any }) => {
  const [thread, setThread] = useState<any>();
  const [posts, setPosts] = useState<ThreadPost[]>([]);
  const [threadAddress, setThreadAddress] = useState<string>('');
  const { onCopy } = useClipboard(threadAddress);

  const postMessage = async (message: string) => {
    thread.post(message);
  };

  useEffect(() => {
    if (!thread) return;
    setThreadAddress(thread.address);
    thread.onUpdate(async () => {
      setPosts(await thread.getPosts());
    });
    (async () => {
      setPosts(await thread.getPosts());
    })();
  }, [thread]);

  const joinOwnThread = async () => {
    setThread(await space.joinThread(OPEN_THREAD_NAME));
  };

  const joinThread = async (_threadAddress: string) => {
    setThread(await space.joinThreadByAddress(_threadAddress));
  };

  useEffect(() => {
    joinOwnThread();
  }, []);

  return (thread ? <Flex direction="column">
    <Alert status="success" mb="6">
      <AlertTitle mr={2}>Thread: </AlertTitle>
      <AlertDescription isTruncated>{threadAddress}</AlertDescription>
      <Flex>
        <IconButton variantColor="green" aria-label="Copy address" icon="copy"
          onClick={onCopy}
        />
        <IconButton variantColor="green" aria-label="join own thread" icon="repeat-clock"
          onClick={joinOwnThread}
        />
      </Flex>
    </Alert>
    <JoinThread joinThread={joinThread} />
    {posts.map((post, i) => <ThreadMessageDisplay key={`post-${post.postId}`} post={post} />)}
    <NewMessageForm onSubmitted={postMessage} />
  </Flex> : <Box>creating thread...</Box>);
};

export default ThreeBoxOpenThread;
