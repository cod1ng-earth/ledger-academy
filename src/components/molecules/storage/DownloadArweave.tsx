import React, { useState } from 'react';
import {
  InputGroup, Input, InputRightElement, Button,
} from '@chakra-ui/core';
import { downloadFromArweave } from 'modules/arweave';

const DownloadArweave = (props: any) => {
  const [transactionId, setTransactionId] = useState<string>('');
  return (<form onSubmit={(e) => { e.preventDefault(); downloadFromArweave({ arweave: props.arweave, transactionId }); }}>
    <InputGroup size="md">
        <Input
            name="transactionId"
            onChange={(e: any) => setTransactionId(e.target.value)} value={transactionId}
            type="text"
            placeholder="some transaction id"
        />
        <InputRightElement width="6.5rem">
            <Button h="1.75rem" size="sm" type="submit">
                download
            </Button>
        </InputRightElement>
    </InputGroup>
  </form>);
};

export default DownloadArweave;
