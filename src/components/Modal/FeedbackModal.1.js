import React, { useRef, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Textarea,
    Box,
    Flex,
    Button,
    useToast,
} from '@chakra-ui/react';
import { BsEmojiNeutral } from 'react-icons/bs';
import { GrEmoji } from 'react-icons/gr';
import { BsEmojiLaughing } from 'react-icons/bs';
import { BsEmojiFrown } from 'react-icons/bs';
import { HiOutlineFaceFrown } from 'react-icons/hi2';
import { useKeycloak } from '@react-keycloak/web';
import wedaaImg from '../../assets/wedaa_logo.png';

export const FeedbackModal = ({ isOpen, onClose }) => {
    const initialRef = useRef();
    const toastIdRef = useRef();
    const { initialized, keycloak } = useKeycloak();
    const toast = useToast({
        containerStyle: {
            width: '500px',
            maxWidth: '100%',
        },
    });

    const checkFeedbackValidity = feedbackData => {
        if (feedbackData?.rating === null) {
            return { isValid: false, message: 'Please enter a rating for your feedback.' };
        }

        if (feedbackData?.description.trim() === '') {
            return { isValid: false, message: 'Please provide a detailed feedback description.' };
        }

        if (feedbackData?.email && feedbackData?.email.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(feedbackData.email)) {
                return { isValid: false, message: 'Please enter a valid email address.' };
            }
        }

        return { isValid: true, message: 'Feedback Submitted Succesfully.' };
    };

    const handleSubmit = async feedbackData => {
        const { isValid, message } = checkFeedbackValidity(feedbackData);
        const errorMessage = message || 'Validation failed';

        toast.close(toastIdRef.current);
        toastIdRef.current = toast({
            title: errorMessage,
            status: isValid ? 'success' : 'error',
            duration: 3000,
            variant: 'left-accent',
            isClosable: true,
        });

        if (isValid) {
            feedbackData.user_id = keycloak?.tokenParsed?.sub || 'anonymous';
            await fetch(process.env.REACT_APP_API_BASE_URL + '/feedback', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
                body: JSON.stringify(feedbackData),
            }).catch(error => console.error(error));
            setFeedbackData(initialState);
            onClose();
        }
    };

    const initialState = {
        rating: null,
        description: '',
        name: '',
        email: '',
    };
    const [feedbackData, setFeedbackData] = useState(initialState);
    const [hoveredRating, setHoveredRating] = useState(null);

    const ratingComponents = [
        { component: BsEmojiFrown, label: 'Frown', color: '#8B0000' },
        { component: HiOutlineFaceFrown, label: 'Sad', color: '#FF3333' },
        { component: BsEmojiNeutral, label: 'Neutral', color: '#FFFF00' },
        { component: GrEmoji, label: 'Grinning', color: '#90EE90' },
        { component: BsEmojiLaughing, label: 'Laughing', color: '#006400' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef} isCentered size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader borderTopRadius="md" p={1}>
                    <Flex alignItems="center" justify="center" direction="column">
                        <img src={wedaaImg} alt="Feedback Image" boxSize="40px" height="70px" width="70px" mb={2} />
                        <FormLabel fontSize="2xl" fontWeight="bold" textAlign="center">
                            Values your Feedback!
                        </FormLabel>
                    </Flex>
                </ModalHeader>

                <ModalCloseButton />
                <ModalBody pb={2}>
                    <FormLabel fontSize="xl" textAlign="center" mb={4} color={'hsl(42, 83%, 53%)'}>
                        Help us to get better!
                    </FormLabel>

                    <Flex justify="center" mb={4}>
                        {ratingComponents.map(({ component: RatingComponent, label, color }, index) => (
                            <Box
                                key={index}
                                style={{
                                    width: index === 1 || index === 3 ? '100px' : '80px',
                                    height: '80px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '6px',
                                    margin: '0 6px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease-in-out',
                                }}
                                onClick={() => setFeedbackData({ ...feedbackData, rating: index + 1 })}
                                onMouseEnter={() => setHoveredRating(index + 1)}
                                onMouseLeave={() => setHoveredRating(null)}
                                _hover={{
                                    transform: 'scale(1.2)',
                                }}
                            >
                                <RatingComponent
                                    style={{
                                        fontSize: '3rem',
                                        color: hoveredRating === index + 1 || feedbackData.rating === index + 1 ? color : 'gray',
                                    }}
                                    aria-label={label}
                                />
                            </Box>
                        ))}
                    </Flex>

                    <FormControl mb={4}>
                        <Textarea
                            backgroundColor="#f2f6f8"
                            color={'#212529'}
                            borderRadius={'0.5rem'}
                            minHeight={'120px'}
                            placeholder="Enter your feedback here..."
                            value={feedbackData.description}
                            onChange={e => setFeedbackData({ ...feedbackData, description: e.target.value })}
                            size="md"
                        />
                    </FormControl>

                    <Flex direction="row" justify="space-between" mb={4}>
                        <input
                            placeholder="Name"
                            value={feedbackData.name}
                            onChange={e => setFeedbackData({ ...feedbackData, name: e.target.value })}
                            ref={initialRef}
                            style={{
                                padding: '8px',
                                width: '100%',
                                borderRadius: '10px',
                                border: '1px solid #ccc',
                                backgroundColor: '#f2f6f8',
                                transition: 'background-color 0.3s ease-in-out',
                            }}
                        />
                    </Flex>

                    <Flex direction="column" mb={1}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={feedbackData.email}
                            onChange={e => setFeedbackData({ ...feedbackData, email: e.target.value })}
                            style={{
                                padding: '8px',
                                width: '100%',
                                borderRadius: '10px',
                                border: '1px solid #ccc',
                                backgroundColor: '#f2f6f8',
                                transition: 'background-color 0.3s ease-in-out',
                            }}
                        />
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button mr={150} backgroundColor="blue.500" onClick={() => handleSubmit(feedbackData)}>
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
