import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Input, Button, FormLabel, FormControl } from '@chakra-ui/react';

const CustomNodeModal = ({ isOpen, onClose, onSubmit, CurrentNode }) => {
    const IntialState = {
        label: '',
        ...CurrentNode,
    };
    const [customData, setCustomData] = useState(IntialState);
    const [nodeType, setNodeType] = useState('Custom Node');

    useEffect(() => {
        if (CurrentNode) {
            var currentNodeType = CurrentNode[Object.keys(CurrentNode)[0]];
            var customNodeNames = {
                oauth2: 'Keycloak',
                postgresql: 'PostgreSQL',
                mongodb: 'mongoDB',
                eureka: 'Eureka',
                eck: 'Elastic Cloud',
            };

            var customNodeName = customNodeNames[currentNodeType] || 'Custom Node';
            setNodeType(customNodeName);
        }
    }, [CurrentNode]);

    useEffect(() => {
        const handleDeleteKeyPress = event => {
            if (isOpen && (event.key === 'Backspace' || event.key === 'Delete') && event.target.tagName !== 'INPUT') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleDeleteKeyPress);
        return () => {
            window.removeEventListener('keydown', handleDeleteKeyPress);
        };
    }, [isOpen, onClose]);

    const handleData = (column, value) => {
        setCustomData(prev => ({
            ...prev,
            [column]: value,
        }));
    };

    return (
        <Modal isOpen={isOpen} onClose={() => onClose(false)}>
            <ModalContent
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '10px',
                    width: '300px',
                }}
            >
                <ModalHeader style={{ textAlign: 'center' }}>{nodeType}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'Left',
                        }}
                    >
                        <FormControl>
                            <FormLabel>Label</FormLabel>
                            <Input
                                mb={3}
                                variant="outline"
                                id="groupName"
                                placeholder="Display Name"
                                borderColor={'black'}
                                maxLength="32"
                                value={customData.label}
                                onChange={e => handleData('label', e.target.value)}
                            />
                        </FormControl>
                    </div>
                    <Button onClick={() => onSubmit(customData)} style={{ display: 'block', margin: '0 auto' }}>
                        Save
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
export default CustomNodeModal;
