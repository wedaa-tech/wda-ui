import React, { useState, useEffect } from 'react';
import { FormControl, FormLabel, Input, Textarea, Button, Divider, Text, VStack, Flex } from '@chakra-ui/react';

function TitleDescriptionForm({ title: initialTitle, description: initialDescription, onNext }) {
    const [title, setTitle] = useState(initialTitle || '');
    const [description, setDescription] = useState(initialDescription || '');
    const [isFilled, setIsFilled] = useState(false);

    useEffect(() => {
        checkFormValidity(title);
    }, [title]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const checkFormValidity = (title) => {
        if (title.trim() !== '') {
            setIsFilled(true);
        } else {
            setIsFilled(false);
        }
    };

    const handleNext = () => {
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
                <Button colorScheme="blue" onClick={handleNext} mt={4} isDisabled={!isFilled}>
                    Next
                </Button>
            </Flex>
        </VStack>
    );
}

export default TitleDescriptionForm;
