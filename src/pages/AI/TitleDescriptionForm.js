import React, { useState, useEffect, useRef } from 'react';
import { FormControl, FormLabel, Input, Textarea, Button, Divider, Text, VStack, Flex, useToast, IconButton,Tooltip } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import { FaSync } from 'react-icons/fa';
import { useKeycloak } from '@react-keycloak/web';

function TitleDescriptionForm({ title: initialTitle, description: initialDescription, onNext }) {
    const [title, setTitle] = useState(initialTitle || '');
    const [description, setDescription] = useState(initialDescription || '');
    const containsNoSpecialCharacters = /^[a-zA-Z0-9 ]+$/;
    const { initialized, keycloak } = useKeycloak();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditorAvailable, setIsEditorAvailable] = useState(initialDescription);

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
                })
                .catch(error => {
                    console.error('Error adding descrition to service:', error);
                });
                setIsEditorAvailable(true);
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
    }
    const checkFormValidity = () =>{
        return checkTitleValidity() && checkDescriptionValidity()
    }

    const handleNext = () => {
        if (checkFormValidity(title)) onNext({ title, description });
    };

    return (
        <VStack spacing={4}>
            <Text fontSize="xl" fontWeight="bold">
                Describe Your Application
            </Text>
            <Divider />
            <FormControl>
                <FormLabel marginLeft={"6"} >Title</FormLabel>
                <Input marginLeft={"7"} maxWidth={"800"} placeholder="Enter Application Name" value={title} onChange={handleTitleChange} />
            </FormControl>
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
                    <Tooltip label="Generate" placement="right"  bg="blue.500" color="white" fontSize="sm" offset={[0, -4]} borderRadius="md" >
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
                        height: '270px',
                        maxWidth:'800px',
                        border: '1px solid #D3D3D3',
                        borderRadius: '5px',
                        padding: '5px',
                        marginBottom: '10px',
                        backgroundColor: isEditorAvailable ? 'white' : '#FAFAFA',
                        borderColor: '#D3D3D3',
                        cursor: !isEditorAvailable && 'not-allowed',
                        position: 'relative',
                        marginLeft:'29px'
                    }}
                >
                    {!isEditorAvailable && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '10%',
                                left: '32%',
                                transform: 'translate(-50%, -50%)',
                                color: '#A0A0A0',
                            }}
                        >
                            Click the Generate button to populate the description field
                        </div>
                    )}

                    {isEditorAvailable && (
                        <Editor
                            height="100%"
                            options={{
                                minimap: { enabled: false },
                                lineNumbers: 'off',
                                wordWrap: 'on',
                                renderLineHighlight: 'none' 
                            }}
                            value={description}
                            onChange={value => {
                                handleDescriptionChange(value);
                            }}
                            style={{ overflowX: 'hidden' }}
                        />
                    )}
                </div>
            </FormControl>
            <Flex justify="flex-end" w="100%">
                <Button colorScheme="blue" onClick={handleNext} mt={4}>
                    Next
                </Button>
            </Flex>
        </VStack>
    );
}

export default TitleDescriptionForm;
