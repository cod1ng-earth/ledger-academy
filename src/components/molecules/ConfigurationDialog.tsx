import {
  Box, FormControl, FormLabel, Heading, Input, Button,
} from '@chakra-ui/core';
import { useConfiguration } from 'context/ConfigurationContext';
import React from 'react';

const ConfigurationDialog = () => {
  const {
    pinningServiceConfiguration: config,
    updatePinningServiceConfiguration: setConfig,
  } = useConfiguration();

  const updatePinningServiceSettings = (e: any) => {
    e.preventDefault();
    setConfig({
      url: e.target.url.value,
      username: e.target.username.value,
      password: e.target.password.value,
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
                  <FormLabel htmlFor="username">User Name</FormLabel>
                  <Input
                      name="username"
                      type="text"
                      id="username"
                      defaultValue={config.username || ''}
                  />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="url">Password</FormLabel>
                    <Input
                        name="password"
                        type="password"
                        id="password"
                        defaultValue={config.password || ''}
                    />
                </FormControl>
                <Button type="submit" variantColor="teal" my={3}>save</Button>
            </form>
        </Box>
  );
};

export default ConfigurationDialog;
