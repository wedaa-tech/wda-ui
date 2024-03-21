import React, { useState } from 'react';
import { VStack, Text, Divider, Box, HStack, IconButton, Spacer, Button, Flex } from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import ServiceFormModal from './ServiceFormModal';

function ServiceForm({ serviceData, setServiceData, onNext, onBack, title }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [modalMode, setModalMode] = useState('add');

    const addService = () => {
        setModalMode('add');
        setSelectedService(null);
        setIsModalOpen(true);
    };

    const deleteService = index => {
        const updatedData = [...serviceData];
        updatedData.splice(index, 1);
        setServiceData(updatedData);
    };

    const handleEdit = service => {
        setIsModalOpen(true);
        setModalMode('edit');
        setSelectedService(service);
    };

    const handleView = service => {
        setIsModalOpen(true);
        setModalMode('view');
        setSelectedService(service);
    };

    const handleModalSave = data => {
        if (modalMode === 'add') {
            setServiceData([...serviceData, data]);
        } else if (modalMode === 'edit' && selectedService) {
            const updatedData = serviceData.map(service => {
                if (service === selectedService) {
                    return { ...service, ...data };
                }
                return service;
            });
            setServiceData(updatedData);
        }
        setIsModalOpen(false);
    };

    const handleNext = () => {
        onNext(serviceData);
    };

    const handleBack = () => {
        onBack();
    };

    return (
        <Flex direction="column" h="100%">
            <Box flex="1">
                <VStack spacing={6} align="stretch">
                    <HStack justify="space-between" w="100%">
                        <Text fontSize="2xl" fontWeight="bold">
                            Service Information
                        </Text>
                        <Button size="sm" colorScheme="blue" variant="outline" leftIcon={<AddIcon />} onClick={addService}>
                            Add Service
                        </Button>
                    </HStack>
                    <Divider />
                    <Text fontSize="md" color="gray.600">
                            Below, you'll find the services associated with the application {title}. You can view and edit them as needed.
                        </Text>
                    <Box maxH="350px" overflowY="auto" w="100%" mt={-4}>
                        {serviceData.map((service, index) => (
                            <HStack key={index} spacing={4} align="center">
                                <Text>{index + 1}</Text>
                                <VStack align="start">
                                    <Text onClick={() => handleView(service)} textDecoration="underline" cursor="pointer">
                                        {service.name}
                                    </Text>
                                </VStack>
                                <Spacer />
                                <HStack>
                                    <IconButton
                                        aria-label="Edit"
                                        icon={<EditIcon color={'blue'} />}
                                        colorScheme="white"
                                        onClick={() => handleEdit(service)}
                                    />
                                    <IconButton
                                        aria-label="Delete"
                                        icon={<DeleteIcon color={'red'} />}
                                        colorScheme="white"
                                        onClick={() => deleteService(index)}
                                    />
                                </HStack>
                            </HStack>
                        ))}
                    </Box>
                </VStack>
            </Box>
            <Box mt="auto">
                <HStack justify="space-between" w="100%">
                    <Button colorScheme="blue" onClick={handleBack}>
                        Back
                    </Button>
                    <Button colorScheme="blue" onClick={handleNext}>
                        Next
                    </Button>
                </HStack>
            </Box>
            <ServiceFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleModalSave}
                service={selectedService}
                viewMode={modalMode}
            />
        </Flex>
    );
}

export default ServiceForm;
