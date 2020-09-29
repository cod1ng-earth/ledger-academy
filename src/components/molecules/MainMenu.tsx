import { Link, List } from '@chakra-ui/core';
import { Link as ReachLink } from "@reach/router";
import React from 'react';

/* see https://github.com/chakra-ui/chakra-ui/issues/906 */
const MenuItem: React.FC<any> = ({to, children, as: As = React.Fragment}) => {
    return (<As>
            {/* 
            // @ts-ignore */}
            <Link mx={2} as={ReachLink} to={to}>{children}</Link>
            </As>
    )
}

const MainMenu: React.FC<any> = ({as}) => (
    <List>
        <MenuItem to="/" as={as}>eth</MenuItem>
        <MenuItem to="/ipfs" as={as}>ipfs</MenuItem>
        <MenuItem to="/identity" as={as}>identity</MenuItem>
    </List>
)

export default MainMenu;