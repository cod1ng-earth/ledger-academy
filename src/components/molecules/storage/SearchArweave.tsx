import React, {useState} from 'react';
import {
    InputGroup, Input, InputRightElement, Button, List, IconButton, Flex, Box, Text
} from '@chakra-ui/core';
import { and, or, equals } from 'arql-ops';
import {downloadFromArweave} from "../../../modules/download";

const SearchArweave = (props: any) => {
  const [searchTag, setSearchTag] = useState<string>('');
  const [searchResult, setSearchResult] = useState<[]>([]);

  const search = async () => {
    const query = and(
      equals('Content-Type', 'application/text'),
      or(
        equals('cid', searchTag),
        equals('filename', searchTag),
        equals('search', searchTag),
      )
    );
    const result = await props.arweave.arql(query);
    setSearchResult(result);
    console.log(searchResult);
  };

  return (<form onSubmit={(e) => { e.preventDefault(); search(); }}>
    <InputGroup size="md">
        <Input
            name="cid"
            onChange={(e: any) => setSearchTag(e.target.value)} value={searchTag}
            type="text"
            placeholder="SEARCH TAG"
        />
        <InputRightElement width="6.5rem">
            <Button h="1.75rem" size="sm" type="submit">
                search
            </Button>
        </InputRightElement>
    </InputGroup>
    <List>
        {searchResult.map((r) => <Flex mt="1" p="1" bg="gray.100" d="flex" align="center" justify="space-between">
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
                    onClick={() => downloadFromArweave({ arweave: props.arweave, transactionId: r })}
                    size="sm"
                />
            </Flex>
        </Flex>)}
    </List>
  </form>);
};

export default SearchArweave;
