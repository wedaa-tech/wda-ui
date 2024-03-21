import React, { useState, useEffect,useRef } from 'react';
import { FormControl, FormLabel, Input, Textarea, Button, Divider, Text, VStack, Flex ,useToast} from '@chakra-ui/react';

function TitleDescriptionForm({ title: initialTitle, description: initialDescription, onNext }) {
    const [title, setTitle] = useState(initialTitle || '');
    const [description, setDescription] = useState(initialDescription || '');
    const containsNoSpecialCharacters = /^[a-zA-Z0-9 ]+$/;
    const toast = useToast({
        containerStyle: {
            width: '500px',
            maxWidth: '100%',
        },
    });
    const toastIdRef = useRef();

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const raiseError = (errorMessage) =>{
        toast.close(toastIdRef.current);
        toastIdRef.current = toast({
            title: errorMessage,
            status: 'error',
            duration: 3000,
            variant: 'left-accent',
            isClosable: true,
        });
    }

    const checkFormValidity = (title) => {
        if (title.trim() === '') {
            raiseError("Title should not be Empty")
            return false
        } else if(!containsNoSpecialCharacters.test(title)) {
            raiseError("Title sould not contain Special charecters")
            return false
        }
        else{
            return true        
        }
    };

    const handleNext = () => {
        if(checkFormValidity(title))
        onNext({ title, description });
    };

    return (
        <VStack spacing={4}>
            <Text fontSize="xl" fontWeight="bold">
                Describe Your Application
            </Text>
            <Divider />
            <FormControl>
                <FormLabel>Title</FormLabel>
                <Input placeholder="Enter Title" value={title} onChange={handleTitleChange} />
            </FormControl>
            <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                    placeholder="Give a Detailed Description about the Application"
                    value={description}
                    onChange={handleDescriptionChange}
                    w="100%"
                    h="300px"
                />
            </FormControl>
            <Flex justify="flex-end" w="100%">
                <Button colorScheme="blue" onClick={handleNext} mt={4} >
                    Next
                </Button>
            </Flex>
        </VStack>
    );
}

export default TitleDescriptionForm;
