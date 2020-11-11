import { Box } from '@chakra-ui/core';
import { createIcon } from '@download/blockies';
import React, { useEffect, useRef } from 'react';

const Blockie = (props: any) => {
  const { address } = props;

  const r = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (!r.current) return;
      // https://github.com/MetaMask/metamask-extension/blob/develop/ui/app/components/ui/identicon/blockieIdenticon/blockieIdenticon.component.js

      const canvasElement: HTMLCanvasElement = createIcon({ seed: address.toLowerCase() });
      r.current.innerHTML = '';
      r.current.appendChild(canvasElement);
    },
    [address],
  );

  return <Box rounded="100%" overflow="hidden" {...props} >
      <span ref={r}/>
    </Box>;
};

export default Blockie;
