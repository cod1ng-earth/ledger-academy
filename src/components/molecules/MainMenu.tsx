import { Link, List } from '@chakra-ui/core';
import {
  Link as RouterLink,
  useLocation,
} from 'react-router-dom';
import React from 'react';

/* see https://github.com/chakra-ui/chakra-ui/issues/906 */
const MenuItem: React.FC<any> = ({ to, children, as: As = React.Fragment }) => {
  const location = useLocation();

  return (<As>
    {/*
            // @ts-ignore */}
    <Link mx={2} as={RouterLink} to={to} color={location.pathname === to ? 'red.300' : ''}>{children}</Link>
  </As>
  );
};

const MainMenu: React.FC<any> = ({ as }) => (
  <List>
    <MenuItem to="/" as={as}>eth</MenuItem>
    <MenuItem to="/storage" as={as}>storage</MenuItem>
    <MenuItem to="/identity" as={as}>identity</MenuItem>
    <MenuItem to="/test" as={as}>Test</MenuItem>
  </List>
);

export default MainMenu;
