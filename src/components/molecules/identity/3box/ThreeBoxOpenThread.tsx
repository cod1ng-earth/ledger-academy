import * as TBox from '3box';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Flex, IconButton, Text, useClipboard,
} from '@chakra-ui/core';
import OneLineTextInput, { InputBase } from 'components/atoms/InputFlex';
import NewMessageForm from 'components/atoms/NewMessageForm';
import { useIPFS } from 'context/IPFS';
import React, { useCallback, useEffect, useState } from 'react';

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
    <OneLineTextInput
      label="join a thread"
      onSubmit={() => {
        joinThread(thread);
        setThread('');
      }}
      initialValue={thread}
      placeholder="thread name"
      submitLabel="join"
    />

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
  }, [ipfsNode, post.author]);

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

  const joinOwnThread = useCallback(async () => {
    setThread(await space.joinThread(OPEN_THREAD_NAME));
  }, [space]);

  const joinThread = useCallback(async (_threadAddress: string) => {
    setThread(await space.joinThreadByAddress(_threadAddress));
  }, [space]);

  useEffect(() => {
    joinOwnThread();
  }, [joinOwnThread]);

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
