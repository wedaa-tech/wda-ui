import { Flex, Menu, MenuButton, Link, MenuItem, MenuList, Button } from '@chakra-ui/react';
import { ArrowDown2, ArrowUp2 } from 'iconsax-react'; // Replace with your component paths
import React from 'react';

import { menuData } from './CONSTANTS';

const MenuOption = ({ option, isLoggedIn, isAdmin, name }) => {
    if (option.login && !isLoggedIn) {
        return;
    }

    if (option.admin && (!isLoggedIn || !isAdmin)) {
        return;
    }

    if (!option.expandable) {
        return (
            <Link href={option.path} isExternal={option.external}>
                <Button
                    as={Flex}
                    bg={'black'}
                    fontWeight={'normal'}
                    fontSize={16}
                    padding="10px 16px"
                    transition="all 0.5s"
                    borderRadius="8px"
                    _hover={{ bg: 'rgba(92, 157, 255, 0.1)', color: 'rgba(92, 157, 255, 1)' }}
                    _focus={{ boxShadow: 'outline' }}
                >
                    <Flex h={'20px'} gap={4}>
                        {React.cloneElement(option.icon, { size: '20px' })}
                        {name}
                    </Flex>
                </Button>
            </Link>
        );
    }

    return (
        <Menu closeOnBlur closeOnSelect>
            {({ isOpen }) => (
                <>
                    <MenuButton
                        as={Flex}
                        padding="10px 16px"
                        transition="all 0.5s"
                        borderRadius="8px"
                        _hover={{ bg: 'rgba(92, 157, 255, 0.1)', color: 'rgba(92, 157, 255, 1)' }}
                        _focus={{ boxShadow: 'outline' }}
                    >
                        <Flex gap={4}>
                            {React.cloneElement(option.icon, { size: '20px' })}
                            {name} {option.expandable && (isOpen ? <ArrowUp2 /> : <ArrowDown2 />)}
                        </Flex>
                    </MenuButton>
                    {option.expandable && (
                        <MenuList as={Flex} flexDirection={'column'} marginTop={6} padding={2} gap={4} color={'black'} bgColor={'#F7F6FA'}>
                            {Object.keys(option.expandable).map((element, index) => (
                                <Link href={option.expandable[element].path} isExternal={option.expandable[element].external}>
                                    <MenuItem key={index} bgColor={'#F7F6FA'} icon={option.expandable[element].icon}>
                                        {element}
                                    </MenuItem>
                                </Link>
                            ))}
                        </MenuList>
                    )}
                </>
            )}
        </Menu>
    );
};

export default MenuOption;
