import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Input,
    Button,
    FormLabel,
    FormControl,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import validatePortNumber from '../../utils/portValidation';

const CustomNodeModal = ({ isOpen, onClose, onSubmit, CurrentNode, handleColorClick, uniquePortNumbers }) => {
    const IntialState = {
        label: '',
        color: '#fff',
        ...CurrentNode,
    };
    const [customData, setCustomData] = useState(IntialState);
    const [nodeType, setNodeType] = useState('Custom Node');
    const [portValidationError, setPortValidationError] = useState({});

    const handleKeyPress = event => {
        const charCode = event.which ? event.which : event.keyCode;
        if ((charCode >= 48 && charCode <= 57) || charCode === 8) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    };

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
        if (column == 'databasePort') {
            const validationErrors = validatePortNumber(value, uniquePortNumbers, CurrentNode?.databasePort);
            setPortValidationError(validationErrors);
            setCustomData(prev => ({
                ...prev,
                [column]: value,
            }));
        } else {
            setCustomData(prev => ({
                ...prev,
                [column]: value,
            }));
        }
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
                        {(nodeType === 'mongoDB' || nodeType === 'PostgreSQL') && (
                            <>
                                <FormControl>
                                    <FormLabel className="required">Port</FormLabel>
                                    <Input
                                        mb={3}
                                        variant="outline"
                                        id="dbPort"
                                        placeholder="Port number"
                                        borderColor={
                                            Object.keys(portValidationError).length > 0
                                                ? 'red'
                                                : 'black'
                                        }
                                        maxLength="5"
                                        value={customData.databasePort}
                                        onKeyPress={handleKeyPress}
                                        onChange={e => handleData('databasePort', e.target.value)}
                                    />
                                </FormControl>
                                {Object.keys(portValidationError).length > 0 && (
                                    <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                        <AlertIcon style={{ width: '14px', height: '14px' }} />
                                        {portValidationError.message} 
                                    </Alert>
                                )}
                            </>
                        )}
                        <FormLabel>Background Color</FormLabel>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginBottom: '20px',
                                gap: '15px',
                            }}
                        >
                            <div
                                className="color"
                                style={{
                                    backgroundColor: '#ffc9c9',
                                    border: customData.color === '#ffc9c9' ? '2px solid #007bff' : '1px solid #cfcfcf',
                                }}
                                onClick={() => {
                                    handleData('color', '#ffc9c9');
                                    handleColorClick('#ffc9c9');
                                }}
                            ></div>
                            <div
                                className="color"
                                style={{
                                    border: customData.color === '#b2f2bb' ? '2px solid #007bff' : '1px solid #cfcfcf',
                                    backgroundColor: '#b2f2bb',
                                }}
                                onClick={() => {
                                    handleData('color', '#b2f2bb');
                                    handleColorClick('#b2f2bb');
                                }}
                            ></div>
                            <div
                                className="color"
                                style={{
                                    border: customData.color === '#a5d8ff' ? '2px solid #007bff' : '1px solid #cfcfcf',
                                    backgroundColor: '#a5d8ff',
                                }}
                                onClick={() => {
                                    handleData('color', '#a5d8ff');
                                    handleColorClick('#a5d8ff');
                                }}
                            ></div>
                            <div
                                className="color"
                                style={{
                                    border: customData.color === '#ffec99' ? '2px solid #007bff' : '1px solid #cfcfcf',
                                    backgroundColor: '#ffec99',
                                }}
                                onClick={() => {
                                    handleData('color', '#ffec99');
                                    handleColorClick('#ffec99');
                                }}
                            ></div>
                            <div
                                className="color"
                                style={{
                                    border: customData.color === '#fff' ? '2px solid #007bff' : '1px solid #cfcfcf',
                                    backgroundColor: '#fff',
                                }}
                                onClick={() => {
                                    handleData('color', '#fff');
                                    handleColorClick('rgba(255, 255, 255, 0)');
                                }}
                            ></div>
                        </div>
                    </div>
                    <Button
                        onClick={() => onSubmit(customData)}
                        isDisabled={
                            ((nodeType === 'mongoDB' || nodeType === 'PostgreSQL') &&
                                (!customData.databasePort ||
                                    customData.databasePort === '' ||
                                    Object.keys(portValidationError).length > 0))
                        }
                        style={{ display: 'block', margin: '0 auto' }}
                    >
                        Save
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
export default CustomNodeModal;
