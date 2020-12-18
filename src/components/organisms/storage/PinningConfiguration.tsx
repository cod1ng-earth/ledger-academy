import {
  Box, FormControl, FormLabel, Heading, Input, Button, InputGroup, InputRightElement,
} from '@chakra-ui/core';
import React, { useState, useEffect } from 'react';
import { IPinningServiceConfiguration } from 'modules/pinning';

export const useConfiguration = () => {
  const [
    pinningServiceConfiguration,
    setPinningServiceConfiguration,
  ] = useState<IPinningServiceConfiguration>({
    url: process.env.REACT_APP_PIN_SERVICE_HOST || '',
    username: null,
    password: null,
  });

  useEffect(() => {
    const storedConfig = localStorage.getItem('pin_config');
    if (storedConfig) {
      const parsed = JSON.parse(storedConfig);
      setPinningServiceConfiguration(parsed as IPinningServiceConfiguration);
    }
  }, []);

  const updatePinningServiceConfiguration = (newConfig: IPinningServiceConfiguration) => {
    localStorage.setItem('pin_config', JSON.stringify(newConfig));
    setPinningServiceConfiguration(newConfig);
  };

  return {
    pinningServiceConfiguration,
    updatePinningServiceConfiguration,
  };
};

export const ConfigurationDialog = ({ config, updateConfig }: {
  config: IPinningServiceConfiguration
  updateConfig: (cfg: IPinningServiceConfiguration) => void,
}) => {
  const updatePinningServiceSettings = (e: any) => {
    e.preventDefault();
    updateConfig({
      url: e.target.url.value,
      username: e.target.username.value,
      password: e.target.password.value,
    });
  };

  const [disclosePassword, setDisclosePassword] = useState<boolean>();

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
                    <InputGroup>
                      <Input
                          pr="4.5rem"
                          name="password"
                          type={disclosePassword ? 'text' : 'password'}
                          id="password"
                          defaultValue={config.password || ''}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" mr={2} size="sm" onClick={() => setDisclosePassword(!disclosePassword)}>show</Button>
                      </InputRightElement>
                    </InputGroup>
                </FormControl>
                <Button type="submit" variantColor="teal" my={3}>save</Button>
            </form>
        </Box>
  );
};

export default ConfigurationDialog;
