import React, { useEffect, useState } from 'react';
import {
    Box,
    Flex,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Image,
    Button,
    VStack,
    Divider,
    Badge,
    IconButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import MenuOption from './MenuOption';
import { Message } from 'iconsax-react';
import { menuData } from './CONSTANTS';
import { useKeycloak } from '@react-keycloak/web';
import logo from '../../assets/wedaa_logo.png';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import ProfilePicture from './ProfilePicture';
import FeedbackModal from '../Modal/FeedbackModal';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import './NavBar.css';
import { FaCoins } from 'react-icons/fa';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Constants from '../../Constants';
import { IoNotificationsOutline } from 'react-icons/io5';
import { useNotification } from '../../context/NotificationContext';

const NavBar = () => {
    const { initialized, keycloak } = useKeycloak();
    const location = useLocation();
    const [userCredits, setUserCredits] = useState(0);
    const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const history = useHistory();
    const { defaultCredits } = Constants;
    const { notifications, setNotifications } = useNotification();
    const [modalContent, setModalContent] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const fetchNotifications = () => {
        const notificationUrl = `${process.env.REACT_APP_NOTIFICATION_SERVICE_URL}/api/notification`;
        fetch(notificationUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: keycloak?.token ? `Bearer ${keycloak.token}` : undefined,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.notifications > 0) {
                    if (data.notifications.length && data.notifications[0] !== notifications[0]) {
                        sendSystemNotification(data.notifications[0].subject);
                    }
                    setNotifications(data.notifications);
                }
            })
            .catch(error => console.error('Error fetching notification:', error));
    };

    const formatTimestamp = timestamp => {
        const now = new Date();
        const notificationDate = new Date(timestamp.seconds * 1000 + timestamp.nanos / 1000000);
        const timeDifference = Math.floor((now - notificationDate) / 1000);
        if (timeDifference < 60) {
            return `${timeDifference} seconds ago`;
        } else if (timeDifference < 3600) {
            const minutes = Math.floor(timeDifference / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (timeDifference < 86400) {
            const hours = Math.floor(timeDifference / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(timeDifference / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
    };

    const unreadCount = (notifications || []).filter(notification => !notification.read).length;

    const fetchCredits = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_CREDIT_SERVICE_URL + '/head', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
            });

            const result = await response.json();

            if (result?.creditsAvailable) {
                setUserCredits(result.creditsAvailable);
            } else if ('found' in result && result.found === false) {
                let userData = {
                    userId: keycloak.tokenParsed.sub,
                    creditsAvailable: defaultCredits.CREDITS,
                    creditsUsed: 0,
                };

                const createResponse = await fetch(process.env.REACT_APP_CREDIT_SERVICE_URL + '/api/credits', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                    },
                    body: JSON.stringify(userData),
                });

                if (createResponse.ok) {
                    setUserCredits(defaultCredits.CREDITS);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const sendSystemNotification = notification => {
        if (Notification.permission === 'granted') {
            new Notification('New Notification', {
                body: notification.message,
            });
        }
    };

    useEffect(() => {
        fetchCredits();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, [initialized, keycloak?.authenticated]);


    const markNotificationAsRead = async notificationdata => {
        if(!notificationdata.read){
        try {
            const response = await fetch(`${process.env.REACT_APP_NOTIFICATION_SERVICE_URL}/api/notification/read/${notificationdata.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
            });
            if (response.ok) {
                if (notificationdata.subject.length > 90) {
                    setModalContent(notificationdata.subject);
                    onOpen();
                }
                setNotifications(prevNotifications =>
                    prevNotifications.map(notification =>
                        notification.id === notificationdata.id ? { ...notification, read: true } : notification,
                    ),
                );
            } else {
                console.error(`Failed to mark notification ${notificationdata.id} as read:`, response.statusText);
            }
        } catch (error) {
            console.error(`Failed to mark notification ${notificationdata.id} as read:`, error);
        }
    }
    };

    useEffect(() => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    const markAllNotificationsAsRead = async () => {
        if(unreadCount>0){
        try {
            const response = await fetch(`${process.env.REACT_APP_NOTIFICATION_SERVICE_URL}/api/notification/read`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
            });
            if (response.ok) {
                setNotifications(prevNotifications =>
                    prevNotifications.map(notification => ({
                        ...notification,
                        read: true,
                    })),
                );
            } else {
                console.error('Failed to mark all notifications as read:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    }
    };

    const handleFeedbackClick = () => {
        setFeedbackModalOpen(true);
    };

    const handleFeedbackModalClose = () => {
        setFeedbackModalOpen(false);
    };

    return (
        <Box
            bgColor="#000000"
            color="white"
            padding="16px 24px"
            height="72px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            position={'fixed'}
            width={'100%'}
            zIndex={9999}
            shadow="md"
        >
            <VStack spacing={12} alignItems="center">
                <Box as={Link} to="/" w="100px" h="24px" overflow="hidden" borderRadius="md">
                    <Image src={logo} alt="Zoomed Image" className="logo" />
                </Box>
            </VStack>

            <Flex alignItems="center">
                {Object.keys(menuData).map((name, index) => (
                    <MenuOption
                        isLoggedIn={keycloak.authenticated}
                        isAdmin={keycloak?.realmAccess?.roles.includes('ADMIN')}
                        key={index}
                        option={menuData[name]}
                        name={name}
                    />
                ))}
                {!keycloak?.realmAccess?.roles.includes('ADMIN') && (
                    <Button
                        bg={'black'}
                        fontWeight={'normal'}
                        fontSize={16}
                        padding="10px 16px"
                        borderRadius="8px"
                        _hover={{ bg: 'rgba(92, 157, 255, 0.1)', color: 'rgba(92, 157, 255, 1)' }}
                        onClick={handleFeedbackClick}
                    >
                        <Flex h={'20px'} gap={4}>
                            <Message size="20px" />
                            Feedback
                        </Flex>
                    </Button>
                )}
            </Flex>
            {keycloak.authenticated ? (
                <Flex alignItems="center" gap={4}>
                    {/* Notifications */}
                    <Menu closeOnBlur={true} closeOnSelect={true}>
                        <Box position="relative" display="inline-block">
                            <MenuButton
                                as={IconButton}
                                icon={<IoNotificationsOutline size={24} />}
                                bg="transparent"
                                color="white"
                                aria-label="Notifications"
                                _hover={{ bg: 'rgba(92, 157, 255, 0.1)', color: 'rgba(92, 157, 255, 1)' }}
                                _focus={{ boxShadow: 'none', bg: 'transparent', color: 'white' }}
                                _active={{ bg: 'transparent' }}
                            />

                            {unreadCount > 0 && (
                                <Badge
                                    colorScheme="red"
                                    borderRadius="full"
                                    position="absolute"
                                    top="3"
                                    right="4"
                                    transform="translate(50%, -50%)"
                                    fontSize="0.75rem"
                                    zIndex={1}
                                >
                                    {unreadCount}
                                </Badge>
                            )}
                        </Box>

                        <MenuList
                            as={Flex}
                            flexDirection={'column'}
                            marginTop={6}
                            padding={3}
                            gap={2}
                            bgColor={'#FFFFFF'}
                            borderRadius={12}
                            boxShadow="lg"
                            minWidth="300px"
                            maxHeight="280px"
                            overflowY="auto"
                        >
                            <Flex
                                justifyContent="space-between"
                                alignItems="center"
                                width="100%"
                                paddingBottom={2}
                                background={'light-grey'}
                            >
                                <Text fontSize="lg" fontWeight="bold" color="black">
                                    Notifications
                                </Text>
                                <Text
                                    fontSize="xs"
                                    fontWeight="medium"
                                    color="blue.500"
                                    cursor="pointer"
                                    onClick={markAllNotificationsAsRead}
                                >
                                    Mark all as Read
                                </Text>
                            </Flex>
                            {/* Notification List */}
                            {notifications.length > 0 ? (
                                notifications.map((notification, index) => {
                                    const message = notification.subject;

                                    const splitMessage = (text, maxChars) => {
                                        const words = text.split(' ');
                                        let lines = [];
                                        let currentLine = '';

                                        words.forEach(word => {
                                            if (currentLine.length + word.length + 1 <= maxChars) {
                                                currentLine = currentLine ? `${currentLine} ${word}` : word;
                                            } else {
                                                lines.push(currentLine);
                                                currentLine = word;
                                            }
                                        });

                                        if (currentLine) {
                                            lines.push(currentLine);
                                        }

                                        if (lines.length > 3) {
                                            lines = lines.slice(0, 3);
                                            lines[2] = `${lines[2].substring(0, lines[2].length - 3)}...`;
                                        }

                                        return lines;
                                    };

                                    const lines = splitMessage(message, 30);

                                    return (
                                        <React.Fragment key={notification.id}>
                                            <MenuItem
                                                as={Flex}
                                                width={'100%'}
                                                bgColor={'#FFFFFF'}
                                                flexDirection="row"
                                                alignItems="center"
                                                gap={3}
                                                onClick={() => markNotificationAsRead(notification)}
                                                _hover={{ bg: 'rgba(0, 0, 0, 0.05)' }}
                                            >
                                                <Flex flexDirection="column" flex="1">
                                                    {lines.map((line, lineIndex) => (
                                                        <Text
                                                            key={lineIndex}
                                                            fontSize="sm"
                                                            color="black"
                                                            fontWeight={!notification.read ? 'bold' : 'medium'}
                                                        >
                                                            {line}
                                                        </Text>
                                                    ))}
                                                    <Text fontSize="xs" color="gray.500">
                                                        {formatTimestamp(notification.createdAt)}
                                                    </Text>
                                                </Flex>
                                                {!notification.read && (
                                                    <Box as="span" width="8px" height="8px" bg="blue.500" borderRadius="full" ml={2} />
                                                )}
                                            </MenuItem>

                                            {index !== notifications.length - 1 && <Divider borderColor="gray.200" />}
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <MenuItem width={'100%'} color={'grey'} flexDirection="column" backgroundColor= {'#ffffff'} _hover={{ bg: '#ffffff' }} cursor={"auto"}>
                                    No new notifications
                                </MenuItem>
                            )}
                        </MenuList>
                    </Menu>

                    {/* Profile Section */}
                    <Menu closeOnBlur={true} closeOnSelect={true}>
                        <MenuButton onClick={fetchCredits}>
                            <ProfilePicture size="smd" name={keycloak.tokenParsed.email} />
                        </MenuButton>
                        <MenuList
                            as={Flex}
                            flexDirection={'column'}
                            marginTop={6}
                            padding={2}
                            gap={4}
                            color={'black'}
                            bgColor={'#F7F6FA'}
                            borderRadius={16}
                        >
                            <MenuItem as={Flex} width={'240px'} bgColor={'#F7F6FA'} flexDirection="column">
                                <Flex justifyContent="flex-start" alignItems="center" gap={4} width="100%" marginBottom="6px">
                                    <ProfilePicture size="md" name={keycloak.tokenParsed.email} />
                                    <Flex flexDirection="column">
                                        <Text fontSize="14px">
                                            {keycloak.tokenParsed.given_name} {keycloak.tokenParsed.family_name}
                                        </Text>
                                        <Text fontSize="12px">{keycloak.tokenParsed.email}</Text>
                                    </Flex>
                                </Flex>
                                <Divider my={2} />
                                <Flex justifyContent="space-between" alignItems="center" width="100%" marginTop="6px">
                                    <Flex alignItems="center" gap={4}>
                                        <Link to="/transactions">
                                            <Flex alignItems="center" gap={4} cursor="pointer">
                                                <FaCoins size={16} color={'#EBAF24'} />
                                                <Text style={{ textDecoration: 'underline' }} fontSize="14px">
                                                    Credits
                                                </Text>
                                            </Flex>
                                        </Link>
                                    </Flex>
                                    <Text fontSize="16px" fontWeight="bold" color="#EBAF24">
                                        {userCredits}
                                    </Text>
                                </Flex>
                                <Divider my={2} />
                                <Flex
                                    justifyContent="space-between"
                                    alignItems="center"
                                    width="100%"
                                    marginTop="6px"
                                    borderRadius={6}
                                    _hover={{ backgroundColor: '#E5E4E9', cursor: 'pointer' }}
                                    onClick={() => {
                                        window.open('https://github.com/orgs/wedaa-tech/discussions/categories/q-a', '_blank');
                                    }}
                                >
                                    <Flex alignItems="center" gap={4} padding={1} paddingLeft={2}>
                                        <Text fontSize="14px">Help</Text>
                                    </Flex>
                                </Flex>
                                <Flex
                                    justifyContent="space-between"
                                    alignItems="center"
                                    width="100%"
                                    marginTop="6px"
                                    borderRadius={6}
                                    gap={4}
                                    padding={1}
                                    paddingLeft={2}
                                    _hover={{ backgroundColor: '#E5E4E9', cursor: 'pointer' }}
                                    onClick={() => history.push('/transactions')}
                                >
                                    <Text fontSize="14px">Transactions</Text>
                                </Flex>
                                <Flex
                                    justifyContent="space-between"
                                    alignItems="center"
                                    width="100%"
                                    marginTop="6px"
                                    borderRadius={6}
                                    _hover={{ backgroundColor: '#E5E4E9', cursor: 'pointer' }}
                                    onClick={() => keycloak.logout({ redirectUri: process.env.REACT_APP_UI_BASE_URL })}
                                >
                                    <Flex alignItems="center" gap={4} padding={1} paddingLeft={2}>
                                        <Text fontSize="14px">Logout</Text>
                                    </Flex>
                                </Flex>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            ) : (
                <Button
                    onClick={() =>
                        keycloak.login({
                            redirectUri: process.env.REACT_APP_UI_BASE_URL + location.pathname,
                        })
                    }
                    borderRadius={8}
                    backgroundColor={'rgb(235 175 36)'}
                    width={20}
                    height={10}
                    fontSize={16}
                    colorScheme="orange"
                    color="black"
                >
                    Login
                </Button>
            )}
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Notification</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <p>{modalContent}</p>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <FeedbackModal isOpen={isFeedbackModalOpen} onClose={handleFeedbackModalClose} />
        </Box>
    );
};

export default NavBar;
