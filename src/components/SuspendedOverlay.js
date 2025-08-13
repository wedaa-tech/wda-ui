import {
    Box,
    VStack,
    Text,
    Button,
    useToast,
} from '@chakra-ui/react';
import { useKeycloak } from '@react-keycloak/web';

const SuspendedOverlay = ({ status = 'suspended' }) => {
    const { keycloak } = useKeycloak();
    const toast = useToast();

    const handleReconnect = () => {
        // Implement reconnection logic
        toast({
            title: 'Reconnecting...',
            description: 'Attempting to reconnect your session.',
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
        // Reload the page to attempt reconnection
        window.location.reload();
    };

    // Determine the message based on status
    const getMessage = () => {
        switch (status) {
            case 'notavailable':
                return {
                    title: 'Sandbox Service Not Available',
                    color: 'orange.500',
                    message: 'The sandbox service is currently not available. This could be due to maintenance or network issues.',
                    buttonText: 'Try Again'
                };
            case 'error':
                return {
                    title: 'Connection Error',
                    color: 'orange.500',
                    message: 'There was an error connecting to the sandbox service. Please try again later.',
                    buttonText: 'Try Again'
                };
            case 'suspended':
            default:
                return {
                    title: 'Session Suspended',
                    color: 'red.500',
                    message: 'Your session has been suspended due to inactivity. Please reconnect to continue working.',
                    buttonText: 'Reconnect'
                };
        }
    };

    const messageData = getMessage();

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(0, 0, 0, 0.8)"
            zIndex={9999}
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <VStack
                spacing={6}
                p={8}
                bg="white"
                borderRadius="lg"
                boxShadow="xl"
                maxW="500px"
                textAlign="center"
            >
                <Text fontSize="2xl" fontWeight="bold" color={messageData.color}>
                    {messageData.title}
                </Text>
                <Text>
                    {messageData.message}
                </Text>
                <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={handleReconnect}
                >
                    Reconnect Session
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => keycloak.logout()}
                >
                    Logout
                </Button>
            </VStack>
        </Box>
    );
};

export default SuspendedOverlay; 