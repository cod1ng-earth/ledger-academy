import React, { useContext, useState, useEffect } from 'react';

interface IPinningServiceConfiguration {
  url: string,
  username: string | null,
  password: string | null
}

interface IConfigurationContext {
  pinningServiceConfiguration: IPinningServiceConfiguration,
  updatePinningServiceConfiguration: Function,
}

const emptyConfig = {
  url: process.env.REACT_APP_PIN_SERVICE_HOST || '',
  username: null,
  password: null,
};

const Configuration = React.createContext<IConfigurationContext>({
  pinningServiceConfiguration: emptyConfig,
  updatePinningServiceConfiguration: () => {},
});

const useConfiguration = () => useContext(Configuration);

const ConfigurationProvider = ({ children }: any) => {
  const [pinningServiceConfiguration, setPinningServiceConfiguration] = useState<IPinningServiceConfiguration>(emptyConfig);

  const updatePinningServiceConfiguration = (newConfig: IPinningServiceConfiguration) => {
    localStorage.setItem('pin_config', JSON.stringify(newConfig));
    setPinningServiceConfiguration(newConfig);
  };

  useEffect(() => {
    const storedConfig = localStorage.getItem('pin_config');
    if (storedConfig) {
      const parsed = JSON.parse(storedConfig);
      setPinningServiceConfiguration(parsed as IPinningServiceConfiguration);
    }
  }, []);
  return (<Configuration.Provider value={{ pinningServiceConfiguration, updatePinningServiceConfiguration }}>
      {children}
    </Configuration.Provider>);
};

export { ConfigurationProvider, useConfiguration };
