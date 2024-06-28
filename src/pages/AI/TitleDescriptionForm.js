import React, { useState, useEffect, useRef } from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    Text,
    VStack,
    Flex,
    useToast,
    IconButton,
    Tooltip,
    Spinner
} from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import { FaSync } from 'react-icons/fa';
import { useKeycloak } from '@react-keycloak/web';
import { HiSparkles } from "react-icons/hi2";
function TitleDescriptionForm({ title: initialTitle, description: initialDescription, onNext }) {
    const [title, setTitle] = useState(initialTitle || '');
    const [description, setDescription] = useState(initialDescription || '');
    const [descriptionFetched, setDescriptionFetched] = useState(initialDescription);
    const containsNoSpecialCharacters = /^[a-zA-Z0-9 ]+$/;
    const { initialized, keycloak } = useKeycloak();
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast({
        containerStyle: {
            width: '500px',
            maxWidth: '100%',
        },
    });
    const toastIdRef = useRef();

    const handleTitleChange = e => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = val => {
        setDescription(val);
    };

    const raiseError = errorMessage => {
        toast.close(toastIdRef.current);
        toastIdRef.current = toast({
            title: errorMessage,
            status: 'error',
            duration: 3000,
            variant: 'left-accent',
            isClosable: true,
        });
    };

    const fetchDescriptionData = async () => {
        if (initialized && keycloak.authenticated && checkTitleValidity()) {
            setIsLoading(true);

            await fetch(process.env.REACT_APP_AI_CORE_URL + '/description', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
                body: JSON.stringify({
                    title: title,
                }),
            })
                .then(response => {
                    setIsLoading(false);
                    if (!response.ok) {
                        throw new Error('Failed to fetch description of application');
                    }
                    return response.json();
                })
                .then(data => {
                    setDescription(data);
                    setDescriptionFetched(true); 
                })
                .catch(error => {
                    console.error('Error adding descrition to service:', error);
                });
        }
    };

    const checkTitleValidity = () => {
        if (title.trim() === '') {
            raiseError('Title should not be Empty');
            return false;
        } else if (!containsNoSpecialCharacters.test(title)) {
            raiseError('Title sould not contain Special charecters');
            return false;
        } else {
            return true;
        }
    };

    const checkDescriptionValidity = () => {
        if (description.trim() === '') {
            raiseError('Please click the Generate button to populate the description field');
            return false;
        }
        return true;
    };
    const checkFormValidity = () => {
        return checkTitleValidity() && checkDescriptionValidity();
    };

    const handleNext = () => {
        if (checkFormValidity(title)) onNext({ title, description });
    };

    return (
        <VStack spacing={6} align="center">
            <Text fontSize="2xl" fontWeight="bold">
                AI Wizard
            </Text>
            <Text fontSize="l" color="gray.600">
                Craft a scalable microservice architecture with a custom title.
            </Text>
            <FormControl>
                <FormLabel marginLeft={"6"}>Title</FormLabel>
                <Input marginLeft={"8"} maxWidth="800" placeholder="Enter Application Name" value={title} onChange={handleTitleChange} />
            </FormControl>
            {!descriptionFetched ? ( 
                <Flex justify="center" w="100%">
                    <Button colorScheme="blue" rightIcon={<HiSparkles />} onClick={fetchDescriptionData} size={"md"} isLoading={isLoading} borderRadius={isLoading ? 'full' : '3xl'} loadingText={"Generating ..."} >
                    {isLoading ? ' ' : 'Generate'}
                    </Button>
                </Flex>
            ) : (
                <>
                    <FormControl>
                        <FormLabel
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0px',
                            }}
                            marginLeft={"6"}
                        >
                            <span>Description</span>
                            <Tooltip label="Regenerate" placement="right"  bg="blue.500" color="white" fontSize="sm" offset={[0, -4]} borderRadius="md" >
                                <IconButton
                                    icon={<FaSync />}
                                    isLoading={isLoading}
                                    onClick={fetchDescriptionData}
                                    aria-label="Refresh"
                                    variant="link"
                                    colorScheme="blue"
                                    style={{ position: 'relative', fontSize: '15px' }}
                                    spin={isLoading}
                                />
                            </Tooltip>
                        </FormLabel>

                        <div
                            style={{
                                height: '240px',
                                maxWidth:'800px',
                                border: '1px solid #D3D3D3',
                                borderRadius: '5px',
                                padding: '5px',
                                marginBottom: '10px',
                                borderColor: '#D3D3D3',
                                position: 'relative',
                                marginLeft:'29px'
                            }}
                        >
                                <Editor
                                    height="100%"
                                    options={{
                                        minimap: { enabled: false },
                                        lineNumbers: 'off',
                                        wordWrap: 'on',
                                        renderLineHighlight: 'none',
                                        language:'markdown' 
                                    }}
                                    defaultLanguage="markdown"
                                    value={description}
                                    onChange={value => {
                                        handleDescriptionChange(value);
                                    }}
                                    style={{ overflowX: 'hidden' }}
                                />
                        </div>
                    </FormControl>
                    <Flex justify="flex-end" w="100%">
                <Button colorScheme="blue" onClick={handleNext} mt={-2}>
                    Next
                </Button>
            </Flex>
                </>
            )}
        </VStack>
    );
}

export default TitleDescriptionForm;
