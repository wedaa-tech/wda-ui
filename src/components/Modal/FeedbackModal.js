import React, { useEffect, useRef, useState } from 'react';
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
    Text,
    Button,
    useToast,
    Image,
} from '@chakra-ui/react';
import { useKeycloak } from '@react-keycloak/web';
import { FaExclamationCircle } from 'react-icons/fa';

const FeedbackModal = ({ isOpen, onClose }) => {
    const initialRef = useRef();
    const toastIdRef = useRef();
    const { initialized, keycloak } = useKeycloak();
    const toast = useToast({
        containerStyle: {
            width: '500px',
            maxWidth: '100%',
        },
    });
    const [isEmailValid, setEmailValid] = useState(true);
    const [isDescriptionValid, setDescriptionValid] = useState(true);

    const checkFeedbackValidity = feedbackData => {
        if (feedbackData?.rating === null) {
            return { isValid: false, message: 'Please enter a rating for your feedback.' };
        }

        if (feedbackData?.description.trim() === '') {
            setDescriptionValid(false);
            return { isValid: false, message: 'Please provide a detailed feedback description.' };
        } else {
            setDescriptionValid(true);
        }

        if (feedbackData?.email && feedbackData?.email.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(feedbackData.email)) {
                setEmailValid(false);
                return { isValid: false, message: 'Please enter a valid email address.' };
            }
        } else {
            setEmailValid(true);
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
        { component: '😥', label: 'Frown', color: '#8B0000' },
        { component: '🙁', label: 'Sad', color: '#FF3333' },
        { component: '😐', label: 'Neutral', color: '#FFFF00' },
        { component: '🙂', label: 'smiling', color: '#90EE90' },
        { component: '😍', label: 'Loved It', color: '#006400' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef} isCentered size="md">
            <ModalOverlay />
            <ModalContent padding="2">
                <ModalHeader borderTopRadius="md" mt={2}>
                    <Flex alignItems="center" justify="center" direction="column">
                        <FormLabel fontSize="2xl" fontWeight="bold" textAlign="center">
                            <Text>
                                W
                                <Text as="span" color={'hsl(42, 83%, 53%)'}>
                                    e
                                </Text>
                                DAA
                            </Text>
                        </FormLabel>
                    </Flex>
                </ModalHeader>

                <ModalCloseButton />
                <ModalBody pb={2} mt={0}>
                    <FormLabel fontSize="xl" textAlign="center">
                        We value your Feedback
                    </FormLabel>
                    <FormLabel fontSize="xl" textAlign="center" mb={4}>
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
                                    transition: 'transform 0.3s ease-in-out, filter 0.3s ease-in-out',
                                    transform: feedbackData.rating === index + 1 ? 'scale(1.2)' : 'scale(1)',
                                    filter: feedbackData.rating === index + 1 ? 'grayscale(0%)' : 'grayscale(100%)',
                                }}
                                onClick={() => {
                                    setFeedbackData({ ...feedbackData, rating: index + 1 });
                                }}
                                onMouseEnter={() => setHoveredRating(index + 1)}
                                onMouseLeave={() => setHoveredRating(null)}
                                _hover={{
                                    transform: 'scale(1.2)',
                                }}
                            >
                                <span
                                    role="img"
                                    aria-label={label}
                                    style={{
                                        fontSize: '2.4rem',
                                        color: hoveredRating === index + 1 ? color : 'gray',
                                    }}
                                >
                                    {RatingComponent}
                                </span>
                            </Box>
                        ))}
                    </Flex>
                    <FormControl mb={4}>
                        <FormLabel paddingLeft={1} htmlFor="name">
                            Name
                        </FormLabel>
                        <input
                            id="name"
                            placeholder="Name (optional)"
                            value={feedbackData.name}
                            onChange={e => setFeedbackData({ ...feedbackData, name: e.target.value })}
                            ref={initialRef}
                            style={{
                                padding: '8px',
                                width: '100%',
                                borderRadius: '10px',
                                border: '1px solid #ccc',
                                transition: 'background-color 0.3s ease-in-out',
                            }}
                        />
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel paddingLeft={1} htmlFor="email">
                            Email
                        </FormLabel>
                        <Flex position="relative">
                            <input
                                id="email"
                                type="email"
                                placeholder="Email (optional)"
                                value={feedbackData.email}
                                onChange={e => setFeedbackData({ ...feedbackData, email: e.target.value })}
                                style={{
                                    padding: '8px',
                                    width: '100%',
                                    borderRadius: '10px',
                                    border: isEmailValid ? '1px solid #ccc' : '1px solid red',
                                    transition: 'background-color 0.3s ease-in-out, border 0.3s ease-in-out',
                                }}
                            />
                            {!isEmailValid && (
                                <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" color="red">
                                    <FaExclamationCircle />
                                </Box>
                            )}
                        </Flex>
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel paddingLeft={1} htmlFor="description" className="required">
                            Description
                        </FormLabel>
                        <Textarea
                            id="description"
                            color={'#212529'}
                            borderRadius={'0.5rem'}
                            minHeight={'120px'}
                            placeholder="Enter your feedback here..."
                            border={isDescriptionValid ? '1px solid #ccc' : '1px solid red'}
                            value={feedbackData.description}
                            onChange={e => setFeedbackData({ ...feedbackData, description: e.target.value })}
                            size="md"
                        />
                        {!isDescriptionValid && (
                            <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" color="red">
                                <FaExclamationCircle />
                            </Box>
                        )}
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Flex justifyContent="center" alignItems="center" width="100%">
                        <Button
                            size="lg"
                            backgroundColor="black"
                            onClick={() => handleSubmit(feedbackData)}
                            style={{ width: '300px' }}
                            _hover={'black'}
                        >
                            Submit
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default FeedbackModal;
