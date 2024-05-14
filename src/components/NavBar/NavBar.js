import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, HStack, Menu, MenuButton, MenuList, MenuItem, Image, Button, VStack, Divider } from '@chakra-ui/react';
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

const NavBar = () => {
    const { initialized,keycloak } = useKeycloak();
    const location = useLocation();
    const [userCredits,setUserCredits]=useState(0);
    const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (initialized && keycloak?.authenticated) {
        const fetchData = async () => {
                fetch(process.env.REACT_APP_API_BASE_URL + '/api/credits', {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                    },
                })
                    .then(response => response.json())
                    .then(result => {
                        if(result?.availableCredits)
                        setUserCredits(result.availableCredits);
                    })
                    .catch(error => console.error(error));
            }
    
        fetchData();
    
        const intervalId = setInterval(fetchData, 3000); 
    
        return () => clearInterval(intervalId);
    };
      }, [initialized,keycloak?.authenticated]);

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
            // minWidth="1440px"
            height="72px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            top={0}
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
                        as={Flex}
                        bg={'black'}
                        fontWeight={'normal'}
                        fontSize={16}
                        padding="10px 16px"
                        transition="all 0.5s"
                        borderRadius="8px"
                        _hover={{ bg: 'rgba(92, 157, 255, 0.1)', color: 'rgba(92, 157, 255, 1)' }}
                        _focus={{ boxShadow: 'outline' }}
                        onClick={handleFeedbackClick}
                    >
                        <Flex h={'20px'} gap={4}>
                            {React.cloneElement(<Message />, { size: '20px' })}
                            {'Feedback'}
                        </Flex>
                    </Button>
                )}
            </Flex>
            {keycloak.authenticated ? (
                <Menu closeOnBlur={true} closeOnSelect={true}>
                    <MenuButton>
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
                                    window.open('https://github.com/orgs/wedaa-tech/discussions', '_blank');
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
                    border="2px solid white"
                    textColor={'black'}
                >
                    Login
                </Button>
            )}
            <FeedbackModal isOpen={isFeedbackModalOpen} onClose={handleFeedbackModalClose} />
        </Box>
    );
};

export default NavBar;
