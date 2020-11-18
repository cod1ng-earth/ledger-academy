import {
  Box, Flex, IconButton, List, Text,
} from '@chakra-ui/core';
import { and, equals, or } from 'arql-ops';
import { downloadFromArweave } from 'modules/arweave';
import React, { useEffect, useState } from 'react';

const ArweaveSearch = ({ arweave, searchPhrase }: {arweave: any, searchPhrase: string}) => {
  const [searchResult, setSearchResult] = useState<any[]>([]);

  useEffect(() => {
    const query = and(
      equals('Content-Type', 'application/text'),
      or(
        equals('cid', searchPhrase),
        equals('filename', searchPhrase),
        equals('search', searchPhrase),
      ),
    );
    (async () => {
      const result = await arweave.arql(query);
      console.debug(result);
      setSearchResult(result);
    })();
  }, [searchPhrase]);

  return (<List>
        {searchResult.map((r) => (
        <Flex key={r} mt="1" p="1" bg="gray.100" d="flex" align="center" justify="space-between">
            <Box>
                <Text as="b">
                    {r}
                </Text>
            </Box>
            <Flex gridGap="2">
                <IconButton
                    variantColor="teal"
                    icon="download"
                    aria-label="Download"
                    onClick={() => downloadFromArweave({ arweave, transactionId: r })}
                    size="sm"
                />
            </Flex>
        </Flex>))}
    </List>);
};

export default ArweaveSearch;
