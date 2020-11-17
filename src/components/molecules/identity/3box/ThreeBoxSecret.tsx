import OneLineTextInput, { InputBase } from 'components/atoms/InputFlex';
import React, { useEffect, useState } from 'react';

const ThreeBoxSecret = ({ space }: { space: any }) => {
  const [secretValue, setSecretValue] = useState<string>('');

  const privateSpace = space.private;
  const updateSecretValue = async (newValue: string) => {
    await privateSpace.set('secret-value', newValue);
    setSecretValue(secretValue);
  };

  useEffect(() => {
    (async () => {
      const _storedSecret = await privateSpace.get('secret-value');
      setSecretValue(_storedSecret || '');
    })();
  }, [privateSpace]);

  return (<InputBase >

    <OneLineTextInput
      label="store a secret value"
      onSubmit={updateSecretValue}
      initialValue={secretValue}
      placeholder="shhhhhh"
      submitLabel="store"
    />

  </InputBase>);
};

export default ThreeBoxSecret;
