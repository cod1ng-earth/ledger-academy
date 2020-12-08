import React, { useState } from 'react';
import {
  InputGroup, Input, InputRightElement, Button,
} from '@chakra-ui/core';
import { pin } from 'modules/pinservice';

const PinCid = () => {
  const [sCid, setSCid] = useState<string>('');

  return (<form onSubmit={(e) => { e.preventDefault(); pin(sCid); }}>
    <InputGroup size="md">
        <Input
            name="cid"
            onChange={(e: any) => setSCid(e.target.value)} value={sCid}
            type="text"
            placeholder="CID"
        />
        <InputRightElement width="6.5rem">
            <Button h="1.75rem" size="sm" type="submit">
                pin
            </Button>
        </InputRightElement>
    </InputGroup>
  </form>);
};

export default PinCid;
