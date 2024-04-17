import { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    Textarea,
    ModalFooter,
    Box,
    Divider,
} from '@chakra-ui/react';

function ServiceFormModal({ isOpen, onClose, onSave, service, viewMode }) {
    const [serviceName, setServiceName] = useState('');
    const [serviceDescription, setServiceDescription] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    useEffect(() => {
        if (viewMode === 'view') setEditMode(false);
        else setEditMode(true);

        if (service) {
            setServiceName(service.name);
            setServiceDescription(service.description);
        } else {
            setServiceName('');
            setServiceDescription('');
        }
    }, [viewMode, service]);

    useEffect(() => {
        setIsFilled(serviceName.trim() !== '');
    }, [serviceName]);

    const handleSave = () => {
        onSave({ name: serviceName, description: serviceDescription });
        setServiceName('');
        setServiceDescription('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'3xl'}>
            <ModalOverlay />
            <ModalContent style={{ position: 'absolute', top: '18%', left: '28%', transform: 'translate(-50%, -50%)', height: '450px'}}>
                <ModalHeader>{viewMode === 'view' ? serviceName : service ? `Edit Service` : 'Add Service'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box mb={4}>
                        {editMode ? (
                            <>
                                <Input placeholder="Service Name" value={serviceName} onChange={e => setServiceName(e.target.value)} />
                                <Textarea
                                    placeholder="Service Description"
                                    value={serviceDescription}
                                    onChange={e => setServiceDescription(e.target.value)}
                                    mt={2}
                                    style={{ height: '245px',maxHeight:'250px' }}
                                />
                            </>
                        ) : (
                            <>
                                <Textarea
                                    placeholder="Service Description"
                                    value={serviceDescription}
                                    isReadOnly
                                    mt={2}
                                    style={{ height: '350px' }}
                                />
                            </>
                        )}
                    </Box>
                </ModalBody>
                {editMode && (
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} mt={-3} onClick={handleSave} isDisabled={!isFilled}>
                            Save
                        </Button>
                        <Button
                            mt={-3}
                            onClick={() => {
                                onClose();
                                setServiceName('');
                                setServiceDescription('');
                            }}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                )}
            </ModalContent>
        </Modal>
    );
}

export default ServiceFormModal;