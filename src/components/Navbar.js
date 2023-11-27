import { Box, Flex, HStack, Button, Text, Image, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import logo from '../assets/wedaa_logo.png';
import { useKeycloak } from '@react-keycloak/web';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import FeedbackModal from './Modal/FeedbackModal';

export default function Header({ children }) {
    const color = '#ffffff';
    const bg = '#000';
    const { keycloak, initialized } = useKeycloak();
    const location = useLocation();
    const timerRef = useRef();
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);

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

    const handleFeedbackClick = () => {
        setFeedbackModalOpen(true);
    };

    const handleFeedbackModalClose = () => {
        setFeedbackModalOpen(false);
    };

    return (
        <Box bg={bg} py={4} px={6} top={0} position={'sticky'} width={'100%'} zIndex={9999} shadow="md">
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
                    <Link to="/">
                        <Text fontSize="md" color={location.pathname === '/' ? 'hsl(42, 83%, 53%)' : color} fontWeight="bold">
                            Home
                        </Text>
                    </Link>
                    {initialized && keycloak.authenticated && (
                        <Link to="/prototypes">
                            <Text fontSize="md" color={location.pathname === '/prototypes' ? 'hsl(42, 83%, 53%)' : color} fontWeight="bold">
                                Prototypes
                            </Text>
                        </Link>
                    )}

                    {initialized && keycloak.authenticated && keycloak?.realmAccess?.roles.includes('ADMIN') && (
                        <Link to="/architectures">
                            <Text
                                fontSize="md"
                                color={location.pathname === '/architectures' ? 'hsl(42, 83%, 53%)' : color}
                                fontWeight="bold"
                            >
                                Ref.Architectures
                            </Text>
                        </Link>
                    )}
                    <Menu isOpen={isOpenMenu}>
                        <MenuButton
                            px={1}
                            py={1}
                            fontSize="md"
                            color={
                                location.pathname.startsWith('/wizard') || location.pathname.toLowerCase() === '/canvastocode'
                                    ? 'hsl(42, 83%, 53%)'
                                    : color
                            }
                            bg={bg}
                            onMouseEnter={btnMouseEnterEvent}
                            onMouseLeave={btnMouseLeaveEvent}
                            style={{ cursor: 'text' }}
                            fontWeight="bold"
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
                            <Link to="/wizardselection" onClick={() => setIsOpenMenu(false)}>
                                <MenuItem
                                    fontSize="md"
                                    fontWeight="bold"
                                    bg={bg}
                                    color={color}
                                    _hover={{
                                        color: 'hsl(42, 83%, 53%)',
                                    }}
                                >
                                    Quickstart
                                </MenuItem>
                            </Link>
                            <Link to="/canvasToCode" onClick={() => setIsOpenMenu(false)}>
                                <MenuItem
                                    fontSize="md"
                                    fontWeight="bold"
                                    bg={bg}
                                    _hover={{
                                        color: 'hsl(42, 83%, 53%)',
                                    }}
                                >
                                    Advanced
                                </MenuItem>
                            </Link>
                        </MenuList>
                    </Menu>
                    <Link onClick={() => window.open(process.env.REACT_APP_DOCS_URL)}>
                        <Text fontSize="md" color={color} fontWeight="bold">
                            Docs
                        </Text>
                    </Link>
                    {!keycloak?.realmAccess?.roles.includes('ADMIN') && (
                        <Text fontSize="md" color={color} onClick={handleFeedbackClick} cursor="pointer" fontWeight="bold">
                            Feedback
                        </Text>
                    )}
                    {keycloak?.realmAccess?.roles.includes('ADMIN') && (
                        <Link to="/feedbacks">
                            <Text
                                fontSize="md"
                                color={location.pathname === '/feedbacks' ? 'hsl(42, 83%, 53%)' : color}
                                cursor="pointer"
                                fontWeight="bold"
                            >
                                Feedback
                            </Text>
                        </Link>
                    )}
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
                            fontWeight="bold"
                        >
                            Login
                        </Text>
                    )}

                    {keycloak.authenticated && (
                        <Text
                            fontSize="md"
                            color={color}
                            cursor="pointer"
                            fontWeight="bold"
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
            <FeedbackModal isOpen={isFeedbackModalOpen} onClose={handleFeedbackModalClose} />
            {children}
        </Box>
    );
}
