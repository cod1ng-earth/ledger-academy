import {
  Box, Flex, Heading, Text,
} from '@chakra-ui/core';
import OneLineTextInput, { InputBase } from 'components/atoms/InputFlex';
import { default as ODB } from 'orbit-db';
import React, { useCallback, useEffect, useState } from 'react';
import { useIPFS } from 'context/IPFS';

interface LogMessage {
  message: string
}

// const textDecoder = new TextDecoder('utf-8');

const OrbitDB = () => {
  const { ipfsNode } = useIPFS();

  const [db, setDb] = useState<any>();

  const [messages, setMessages] = useState<LogMessage[]>([]);

  const reload = useCallback(async () => {
    console.debug('reload called');
    const _messages = db.iterator({ limit: 20, reverse: true })
      .collect()
      .map((e: any) => e.payload.value);
    setMessages(_messages);
  }, [db]);

  const addMessage = async (msg: string) => {
    const hash = await db.add({ message: msg });
    console.log('added', hash);
    reload();
  };

  useEffect(() => {
    if (db) {
      reload();
      console.debug('local db loaded:', db.address.toString());
      db.events.on('replicate', (address: string) => console.debug('replicate', address));
      db.events.on('replicated', (address: string) => console.log('replicated', address));
      db.events.on('replicate.progress',
        (address: string) => console.debug('replicate.progress', address));
      db.events.on('load', (dbname: string) => console.debug('start loading', dbname));
      db.events.on('ready', (dbname: string) => console.log('ready', dbname));

      db.events.on('replicated', () => reload());

      return () => {
        db.events.removeAllListeners();
      };
    }
  }, [db, reload]);

  const connectDb = async (dbname: string) => {
    const orbitDb = await ODB.createInstance(ipfsNode);
    const _db = await orbitDb.feed(dbname,
      {
        accessController: {
          write: ['*'], // Give write access to everyone
        },
      });
    await _db.load();
    setDb(_db);
  };

  return (<Flex direction="column">
    <Heading as="h2" size="md" my="2">OrbitDB</Heading>

    <InputBase>
      <OneLineTextInput
        label="db name"
        initialValue="foo"
        onSubmit={connectDb}
        submitLabel="connect"
      />
    </InputBase>
    {messages.map((msg: LogMessage, i) => <Box p={2} key={`msg-${i}`}>
      <Text>{msg.message}</Text>
    </Box>)}
    {
      db && <OneLineTextInput label="add a message" onSubmit={addMessage} submitLabel="add" />
    }
  </Flex>
  );
};

export default OrbitDB;
