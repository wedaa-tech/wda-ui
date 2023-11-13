import { Box, Flex, HStack, Button, Text, Image, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import logo from '../assets/wedaa_logo.png';
import { useKeycloak } from '@react-keycloak/web';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

export default function Header({ children }) {
    const color = '#ffffff';
    const bg = '#000';
    const { keycloak, initialized } = useKeycloak();
    const location = useLocation();
    const timerRef = useRef();
    const [isOpenMenu, setIsOpenMenu] = useState(false);

    const btnMouseEnterEvent = () => {
        setIsOpenMenu(true);
    };

    const btnMouseLeaveEvent = () => {
        timerRef.current = window.setTimeout(() => {
            setIsOpenMenu(false);
        }, 150);
    };

    const menuListMouseEnterEvent = () => {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
        setIsOpenMenu(true);
    };

    const menuListMouseLeaveEvent = () => {
        setIsOpenMenu(false);
    };
    return (
        <Box bg={bg} py={4} px={6} shadow="md">
            <Flex alignItems="center" justifyContent="space-between" maxW="7xl" mx="auto">
                <Flex alignItems="center">
                    <Link to="/">
                        <Image
                            src={logo}
                            alt="App Logo"
                            style={{
                                width: '18px',
                                height: '15px',
                                marginRight: '30px',
                                transform: 'scale(3.5)',
                            }}
                        />
                    </Link>
                </Flex>
                <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
                    {initialized && keycloak.authenticated && (
                        <Link to="/projects">
                            <Text fontSize="md" color={color} fontWeight={location.pathname === '/projects' ? 'bold' : 'normal'}>
                                Projects
                            </Text>
                        </Link>
                    )}
                    <Menu isOpen={isOpenMenu}>
                        <MenuButton
                            px={1}
                            py={1}
                            fontSize="md"
                            color={color}
                            bg={bg}
                            onMouseEnter={btnMouseEnterEvent}
                            onMouseLeave={btnMouseLeaveEvent}
                            style={{ cursor: 'text' }}
                            fontWeight={
                                location.pathname === '/wizard' ||
                                location.pathname === '/' ||
                                location.pathname.toLowerCase() === '/canvastocode'
                                    ? 'bold'
                                    : 'normal'
                            }
                        >
                            CanvasToCode {isOpenMenu ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </MenuButton>
                        <MenuList
                            minWidth="150px"
                            fontSize="md"
                            bg={bg}
                            color={color}
                            borderColor={bg}
                            onMouseEnter={menuListMouseEnterEvent}
                            onMouseLeave={menuListMouseLeaveEvent}
                        >
                            <Link to="/wizard">
                                <MenuItem
                                    fontSize="md"
                                    fontWeight="bold"
                                    bg={bg}
                                    color={color}
                                    _hover={{
                                        backgroundColor: 'darkblue',
                                    }}
                                >
                                    Basic
                                </MenuItem>
                            </Link>
                            <Link to="/canvasToCode">
                                <MenuItem
                                    fontSize="md"
                                    fontWeight="bold"
                                    bg={bg}
                                    _hover={{
                                        backgroundColor: 'darkblue',
                                    }}
                                >
                                    Advanced
                                </MenuItem>
                            </Link>
                        </MenuList>
                    </Menu>
                    <Link onClick={() => window.open(process.env.REACT_APP_DOCS_URL)}>
                        <Text fontSize="md" color={color}>
                            Docs
                        </Text>
                    </Link>
                    {!keycloak.authenticated && (
                        <Text
                            fontSize="md"
                            color={color}
                            onClick={() =>
                                keycloak.login({
                                    redirectUri: process.env.REACT_APP_UI_BASE_URL + 'projects',
                                })
                            }
                            cursor="pointer"
                        >
                            Login
                        </Text>
                    )}

                    {keycloak.authenticated && (
                        <Text
                            fontSize="md"
                            color={color}
                            cursor="pointer"
                            onClick={() =>
                                keycloak.logout({
                                    redirectUri: process.env.REACT_APP_UI_BASE_URL,
                                })
                            }
                        >
                            Logout ({keycloak.tokenParsed.preferred_username})
                        </Text>
                    )}
                </HStack>
                <Box display={{ base: 'block', md: 'none' }}>
                    <Button variant="ghost" colorScheme="blue" size="sm">
                        Menu
                    </Button>
                </Box>
            </Flex>
            {children}
        </Box>
    );
}
