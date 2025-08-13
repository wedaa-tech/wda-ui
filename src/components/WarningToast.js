import { Box, Text, Button, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const WarningToast = ({ timeRemaining }) => {
    const [countdown, setCountdown] = useState(timeRemaining);
    const toast = useToast();

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <Box
            color="white"
            p={3}
            bg="orange.500"
            borderRadius="md"
            boxShadow="lg"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            minW="300px"
        >
            <Text fontWeight="medium">
                Session will expire in {formatTime(countdown)}
            </Text>
            <Button
                size="sm"
                colorScheme="whiteAlpha"
                onClick={() => {
                    toast.closeAll();
                    // Trigger activity to extend session
                }}
            >
                Extend
            </Button>
        </Box>
    );
};

export default WarningToast; 