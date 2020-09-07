import React, { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { Link } from '@reach/router';
import { injected } from './connectors';

const Layout: React.FC = ({ children }) => {
  const { activate, active, error } = useWeb3React<Web3>();

  useEffect(() => {
    activate(injected, console.error);
  }, []);

  return !active && !error ? (
    <div>loading...</div>
  ) : (
    <div>
      <header>
        Demo [
        <Link to="/">main</Link>
        {' '}
        |
        {' '}
        <Link to="/ipfs">ipfs</Link>
        {' '}
        |
        {' '}
        <Link to="/identity">identity</Link>
        ]
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
