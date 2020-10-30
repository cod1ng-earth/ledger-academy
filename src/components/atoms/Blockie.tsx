import { createIcon } from '@download/blockies';
import React, { useEffect, useRef } from 'react';
import { Box, Flex } from '@chakra-ui/core';

const Blockie = (props: any) => {
  const { seed } = props;

  const r = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (!r.current) return;
      const canvasElement: HTMLCanvasElement = createIcon({ seed });
      r.current.innerHTML = '';
      r.current.appendChild(canvasElement);
    },
    [seed],
  );

  return <Box rounded="100%" overflow="hidden" {...props} >
      <span ref={r}/>
    </Box>;
};

export default Blockie;