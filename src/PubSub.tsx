import React, { useState, useCallback, useEffect } from 'react'

import { useIPFS } from './context/IPFS';

interface IIpfsPubSubInterface {
  onTopic: (topic: string) => void;
}

interface MessageDisplayProps {
  data: string;
}

function MessageDisplay({ data }: MessageDisplayProps) {
  const [binaryUrl, setBinaryUrl] = useState<string>();
  const ipfs = useIPFS();

  function isCid(_data: string) {
    return _data.startsWith('Qm');
  }

  useEffect(() => {
    if (!isCid(data)) {
      return;
    }
    try {
      (async () => {
        const res = await ipfs!.files.read(`/ipfs/${data}`);
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
  
const textDecoder = new TextDecoder('utf-8');

const PubSub = (props: IIpfsPubSubInterface) => {
  const [topic, setTopic] = useState<string>('');
  const [newTopic, setNewTopic] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const ipfs = useIPFS();

  async function publish(_message: string): Promise<void> {
    return ipfs!.pubsub.publish(topic, _message);
  }

  function decodeMessageToUtf8(_message: any): object {
    return {
      data: textDecoder.decode(_message.data),
      from: _message.from,
    };
  }

  const handleNewMessage = useCallback((newMessage) => {
    setMessages((prvMessages) => [
      decodeMessageToUtf8(newMessage),
      ...prvMessages,
    ]);
  }, []);

  async function subscribe(_topic: string): Promise<void> {
    if (topic) {
      ipfs!.pubsub.unsubscribe(topic);
    }
    setTopic(_topic);
    props.onTopic(_topic);
    setMessages([]);

    ipfs!.pubsub.subscribe(_topic, handleNewMessage, {
      onError: (err: any) => {
        console.error(err);
      },
    });
  }

  return (<div>
    <form onSubmit={(e) => { e.preventDefault(); subscribe(newTopic); } }>
        <div>
        <input
            name="Topic"
            onChange={(e) => setNewTopic(e.target.value)} value={newTopic}
            type="text"
            placeholder="topic"
        />
        <button type="submit">subscribe.</button>
        </div>
    </form>

    {topic && <form onSubmit={(e) => { e.preventDefault(); publish(message); } }>
        <div>
            <input
                name="Message"
                onChange={(e) => setMessage(e.target.value)} value={message} 
                type="text"
                placeholder="message"
            />
            <button type="submit">send.</button>
        </div>
    </form>}

    {topic && <div>
        <h2>Messages on {topic}</h2>
        {messages.map((m, i) => <div key={`msg-${m.from}-${i}`}>
            <p><b>{m.from}.{i}</b></p>
            <span><MessageDisplay data={m.data} /></span>
        </div>)}
    </div>}

  </div>)
};

export default PubSub;