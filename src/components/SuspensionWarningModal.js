import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const SuspensionWarningModal = ({ isOpen, onClose, timeRemaining }) => {
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

    const handleExtend = () => {
        // Trigger activity to extend session
        toast({
            title: 'Session Extended',
            description: 'Your session has been extended.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader color="orange.500">Session Expiring Soon</ModalHeader>
                <ModalBody>
                    <VStack spacing={4}>
                        <Text>
                            Your session will be suspended in {formatTime(countdown)} due to inactivity.
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                            To prevent suspension, click "Extend Session" or perform any activity.
                        </Text>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="orange" mr={3} onClick={handleExtend}>
                        Extend Session
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default SuspensionWarningModal; 