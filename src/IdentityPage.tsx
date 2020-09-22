import Box from "3box";
import { RouteComponentProps } from '@reach/router';
import { useWeb3React } from '@web3-react/core';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useIPFS } from './context/IPFS';

interface ChangeDetailsProps {
    name: string,
    onNameChanged: (name: string) => void,
}

const ChangeDetails = (props: ChangeDetailsProps) => {
    
    const [name, setName] = useState<string>(props.name || '');

    return (
        <form onSubmit={(e) => {e.preventDefault(); props.onNameChanged(name) } }>
            <label htmlFor="Name">Change your name</label>
            <input
            
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"

            />
            <button type="submit">change</button>
        </form>
    )
}

const IdentityPage = (props: RouteComponentProps) => {
  const { account, library: web3, active: web3Active, error: web3Error } = useWeb3React<Web3>();
  const [profile, setProfile] = useState<any>();
    const [box, setBox] = useState<any>();

  const {ipfsNode} = useIPFS();
  
  
  const loginWith3box = async () => {
    const _box = await Box.openBox(account, web3?.currentProvider, {
      ipfs: ipfsNode,
      consentCallback: (val: any) => console.log("consent", val)
    });
    setBox(_box);
  }

  useEffect(() => {
    if (!box) return;

    (async () => {
        const _profile = await box.public.all();
        console.log(_profile);
        setProfile(_profile);
      })();
  }, [box])

  const changeName = (newName: string) => {
    box.public.set("name", newName);
  }

  return (!web3Active) ? <p>enable web3 please {web3Error} </p> : (
    <div>
      <p>
        oh hai
        {' '}
        <b>{profile ? profile.name : account}</b>
      </p>
      <p><button onClick={loginWith3box}>Login with 3box</button></p>
      {profile &&
        <ChangeDetails name={profile.name} onNameChanged={changeName} />
      }
    </div>
  );
};

export default IdentityPage;
