import React, { useEffect, useState, useCallback } from 'react';
import { RouteComponentProps } from '@reach/router';

const TestPage = () => {
  const [evts, setEvts] = useState<string[]>(['e0']);
  useEffect(() => {
    let i = 1;
    setInterval(() => {
      setEvts((_evts) => [..._evts, `e${i++}`]);
    }, 2000);
  }, []);

  return (
    <ul>
    {evts.map((evt: string, idx: number) => (
        <li key={idx}>{evt}</li>
    ))}
    </ul>
  );
};

export default TestPage;
