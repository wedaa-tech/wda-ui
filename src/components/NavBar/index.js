import React, { useState } from 'react';
import { Box, Flex, Text, HStack, Menu, MenuButton, MenuList, MenuItem, Image, Button, VStack } from '@chakra-ui/react';
import MenuOption from './MenuOption';
import './styles.css';
import { Message } from 'iconsax-react';
import { menuData } from './CONSTANTS';
import { useKeycloak } from '@react-keycloak/web';
import logo from '../../assets/wedaa_logo.png';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import ProfilePicture from './ProfilePicture';
import FeedbackModal from '../Modal/FeedbackModal';

const NavBar = () => {
    const { keycloak } = useKeycloak();
    const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
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
                    <Image src={logo} alt="Zoomed Image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                        <MenuItem as={Flex} gap={4} width={'360px'} bgColor={'#F7F6FA'}>
                            <ProfilePicture size="md" name={keycloak.tokenParsed.email} />
                            <Text flexGrow={1}>{keycloak.tokenParsed.email}</Text>
                            <Button
                                onClick={() =>
                                    keycloak.logout({
                                        redirectUri: process.env.REACT_APP_UI_BASE_URL,
                                    })
                                }
                                borderRadius={8}
                                backgroundColor={'#5C9DFF'}
                                width={20}
                                height={10}
                                fontSize={14}
                            >
                                Logout
                            </Button>
                        </MenuItem>
                    </MenuList>
                </Menu>
            ) : (
                <Button
                    onClick={() =>
                        keycloak.login({
                            redirectUri: process.env.REACT_APP_UI_BASE_URL + 'projects',
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
