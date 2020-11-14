import {
  Box, Flex, Heading, Text,
} from '@chakra-ui/core';
import OneLineTextInput from 'components/atoms/InputFlex';
import { default as ODB } from 'orbit-db';
import React, { useEffect, useState } from 'react';
import { useIPFS } from '../../../context/IPFS';

interface LogMessage {
  message: string
}

// const textDecoder = new TextDecoder('utf-8');

const OrbitDB = () => {
  const { ipfsNode } = useIPFS();

  const [db, setDb] = useState<any>();

  const [messages, setMessages] = useState<LogMessage[]>([]);

  const reload = async () => {
    console.debug('reload called');
    const _messages = db.iterator({ limit: 20 })
      .collect()
      .map((e: any) => e.payload.value);
    setMessages(_messages);
  };

  const addMessage = async (msg: string) => {
    const hash = await db.add({ msg });
    console.log('added', hash);
    reload();
  };

  useEffect(() => {
    if (db) {
      // reloadAttendees(attendeeDb);
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
  }, [db]);

  const connectDb = async (dbname: string) => {
    const orbitDb = await ODB.createInstance(ipfsNode);
    const _db = await orbitDb.create(dbname, 'feed', {
      accessController: {
        write: ['*'], // Give write access to everyone
      },
    });

    await _db.load();
    setDb(_db);
  };

  return (<Flex direction="column" >
    <Heading as="h2" size="md" my="2">OrbitDB</Heading>

    <OneLineTextInput label="db name" onSubmit={connectDb} />
    {messages.map((msg: LogMessage, i) => <Box p={2} key={`msg-${i}`}>
      <Text >{msg.message}</Text>
    </Box>)}

    <OneLineTextInput label="add a message" onSubmit={addMessage} submitLabel="add" />

  </Flex>
  );
};

export default OrbitDB;
