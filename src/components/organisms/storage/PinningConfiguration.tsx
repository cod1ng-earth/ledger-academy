import {
  Box, Button, FormControl, FormLabel, Heading, Input
} from '@chakra-ui/core';
import { IPinningServiceConfiguration } from 'modules/pinning';
import React from 'react'

export const PinningConfigurationDialog = ({ config, updateConfig }: {
  config: IPinningServiceConfiguration
  updateConfig: (cfg: IPinningServiceConfiguration) => void,
}) => {

  const updatePinningServiceSettings = (e: any) => {
    e.preventDefault();
    updateConfig({
      url: e.target.url.value,
      token: e.target.token.value,
    });
  };

  return (
    <Box>
      <Heading size="sm" my={3}>IPFS Pinning Settings</Heading>
      <form onSubmit={updatePinningServiceSettings}>
          <FormControl>
            <FormLabel htmlFor="url">Host</FormLabel>
            <Input
                name="url"
                type="text"
                id="url"
                defaultValue={config.url}
            />
          </FormControl>

          <FormControl>
              <FormLabel htmlFor="url">Token</FormLabel>
              <Input
                  name="token"
                  id="token"
                  defaultValue={config.token || ''}
              />
          </FormControl>
          <Button type="submit" variantColor="teal" my={3}>save</Button>
      </form>
    </Box>
  );
};

export default PinningConfigurationDialog;
