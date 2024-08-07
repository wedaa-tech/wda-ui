import React, { useState } from 'react';
import { VStack, Text, Divider, Box, HStack, IconButton, Spacer, Button, Flex, useStyleConfig, useToast } from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import ServiceFormModal from './ServiceFormModal';
import { useKeycloak } from '@react-keycloak/web';

function ServiceForm({ serviceData, setServiceData, onNext, onBack, title }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [modalMode, setModalMode] = useState('add');
    const { initialized, keycloak } = useKeycloak();
    const toast = useToast({
        containerStyle: {
            width: '500px',
            maxWidth: '100%',
        },
    });
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

    const handleNext = async () => {
        const availableCredits = await fetch(process.env.REACT_APP_CREDIT_SERVICE_URL + '/head', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
            },
        })
            .then(response => response.json())
            .then(result => {
                if (result?.creditsAvailable) {
                    return result.creditsAvailable;
                } else return 0;
            })
            .catch(error => console.error(error));
        const aiServices = serviceData.length;
        if (aiServices > availableCredits) {
            toast({
                title: 'Not enough Credits to Continue Generation. Recharge to Continue',
                status: 'error',
                duration: 3000,
                variant: 'left-accent',
                isClosable: true,
            });
            return;
        }
        onNext(serviceData);
    };

    const handleBack = () => {
        onBack();
    };

    const textStyles = useStyleConfig('Text', { size: 'lg', color: 'gray.600' });

    return (
        <Flex direction="column" h="100%">
            <Box flex="1">
                <VStack spacing={3} align="stretch">
                    <HStack justify="space-between" w="100%">
                        <Text fontSize="2xl" fontWeight="bold" marginLeft={'10'}>
                            Service Information
                        </Text>
                        <Button
                            size="sm"
                            marginRight={'50px'}
                            colorScheme="blue"
                            variant="outline"
                            leftIcon={<AddIcon />}
                            onClick={addService}
                        >
                            Add Service
                        </Button>
                    </HStack>
                    <Divider />
                    <Text sx={textStyles} marginLeft={'10'} marginRight={'14'}>
                        Proposed components for {title} Application.
                    </Text>
                    <Box
                        maxH="350px"
                        overflowY="auto"
                        w="100%"
                        mt={-2}
                        sx={{
                            '&::-webkit-scrollbar': { width: '8px' },
                            '&::-webkit-scrollbar-thumb': { bg: 'blue.300', borderRadius: '8px' },
                        }}
                    >
                        {serviceData.map((service, index) => (
                            <Box
                                key={index}
                                marginTop={'2'}
                                marginLeft={'10'}
                                borderWidth="1px"
                                borderRadius="md"
                                borderColor="gray.200"
                                _hover={{ transform: 'scale(1.02)', transition: 'transform 0.3s ease' }}
                                marginBottom={'2'}
                                width={'3xl'}
                            >
                                <HStack spacing={4} align="center" onClick={() => handleEdit(service)} cursor={'pointer'} width={'3xl'}>
                                    <Text marginLeft={'4'}>{index + 1}</Text>
                                    <VStack align="start">
                                        <Text>{service.name}</Text>
                                    </VStack>
                                    <Spacer />
                                    <IconButton
                                        aria-label="Delete"
                                        icon={<DeleteIcon color={'grey'} />}
                                        colorScheme="white"
                                        a
                                        animation={'ease'}
                                        onClick={e => {
                                            e.stopPropagation();
                                            deleteService(index);
                                        }}
                                        _hover={{
                                            transform: 'scale(1.2)',
                                            transition: 'transform 0.3s ease',
                                        }}
                                    />
                                </HStack>
                            </Box>
                        ))}
                    </Box>
                </VStack>
            </Box>
            {serviceData.length > 0 && (
                <Text marginLeft={'6%'} marginBottom={'2%'} fontSize={'14px'} color={'red'}>
                    * This Prototype Utilizes {serviceData.length} {serviceData.length > 1 ? 'Credits' : 'Credit'} for the code
                    Generation
                </Text>
            )}
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
