import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Input,
    Select,
    Button,
    FormLabel,
    FormControl,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';

const GatewayModal = ({ isOpen, onClose, onSubmit, CurrentNode, handleColorClick, uniqueApplicationNames, uniquePortNumbers }) => {
    const IntialState = {
        label: '',
        applicationName: '',
        applicationFramework: 'java',
        packageName: '',
        serverPort: '',
        applicationType: 'gateway',
        ...CurrentNode,
    };
    const [ApplicationData, setApplicationData] = useState(IntialState);

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

    const [duplicateApplicationNameError, setDuplicateApplicationNameError] = useState(false);

    const [portNumberError, setPortNumberError] = useState(false);

    const validateName = value => {
        const currentApplicationName = CurrentNode?.applicationName;
        const isDuplicateName = uniqueApplicationNames.includes(value) && value !== currentApplicationName;
        if (isDuplicateName && value.length > 0) {
            setDuplicateApplicationNameError(true);
            return false;
        } else {
            setDuplicateApplicationNameError(false);
            return true;
        }
    };

    //check whether port number is unique and lies within the range
    const validatePortNumber = value => {
        const currentServerPort = CurrentNode?.serverPort;
        const isDuplicatePort = uniquePortNumbers.includes(value) && value !== currentServerPort;
        if (isDuplicatePort && value.length > 0) {
            setPortNumberError(true);
            return false;
        } else {
            setPortNumberError(false);
            return true;
        }
    };

    const handleKeyPress = event => {
        const charCode = event.which ? event.which : event.keyCode;
        if ((charCode >= 48 && charCode <= 57) || charCode === 8) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    };

    const handleData = (column, value) => {
        if (column === 'applicationName') {
            validateName(value);
            setApplicationData(prev => ({
                ...prev,
                [column]: value,
            }));
        } else if (column === 'serverPort') {
            validatePortNumber(value);
            setApplicationData(prev => ({
                ...prev,
                [column]: value,
                serverPort: value,
            }));
        } else {
            setApplicationData(prev => ({
                ...prev,
                [column]: value,
            }));
        }
    };

    const isSubmitDisabled =
        ApplicationData.applicationName === '' || ApplicationData.packageName === '' || ApplicationData.serverPort === '';

    const reservedPorts = ['5601', '9200', '15021', '20001', '3000', '8080'];
    const serverPortCheck = ApplicationData.serverPort && reservedPorts.includes(ApplicationData.serverPort);

    const portNumberRangeCheck =
        ApplicationData.serverPort && (Number(ApplicationData.serverPort) < 1024 || Number(ApplicationData.serverPort) > 65535);

    const appNameCheck =
        ApplicationData.applicationName && !/^[a-zA-Z](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$/g.test(ApplicationData.applicationName);

    const packageNameCheck = ApplicationData.packageName && !/^[a-zA-Z](?:[a-zA-Z0-9_.-]*[a-zA-Z0-9])?$/g.test(ApplicationData.packageName);
    return (
        <Modal isOpen={isOpen} onClose={() => onClose(false)}>
            {/* <ModalOverlay /> */}
            <ModalContent
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '10px',
                    width: '300px',
                }}
            >
                <ModalHeader style={{ textAlign: 'center' }}>Gateway</ModalHeader>
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
                                mb={4}
                                variant="outline"
                                id="label"
                                placeholder="Display Name"
                                borderColor={'black'}
                                maxLength="32"
                                value={ApplicationData.label}
                                onChange={e => handleData('label', e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input
                                mb={4}
                                variant="outline"
                                id="applicationName"
                                placeholder="Name"
                                borderColor={duplicateApplicationNameError || appNameCheck ? 'red' : 'black'}
                                maxLength="32"
                                value={ApplicationData.applicationName}
                                onChange={e => handleData('applicationName', e.target.value)}
                            />
                        </FormControl>
                        {appNameCheck && (
                            <Alert status="error" fontSize="12px" padding="4px" borderRadius="3px" mb={2}>
                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                Application Name should not contain -, _ or numbers.
                            </Alert>
                        )}
                        {duplicateApplicationNameError && (
                            <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                Application name already exists. Please choose a unique name.
                            </Alert>
                        )}
                        <FormControl>
                            <FormLabel>Package Name</FormLabel>
                            <Input
                                mb={4}
                                variant="outline"
                                id="packagename"
                                placeholder="packageName"
                                borderColor={packageNameCheck ? 'red' : 'black'}
                                maxLength="32"
                                value={ApplicationData.packageName}
                                onChange={e => handleData('packageName', e.target.value)}
                            />
                        </FormControl>
                        {packageNameCheck && (
                            <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                Enter a valid package name
                            </Alert>
                        )}
                        <FormControl>
                            <FormLabel>Server Port</FormLabel>
                            <Input
                                mb={4}
                                variant="outline"
                                id="serverport"
                                placeholder="Port number"
                                borderColor={portNumberError || serverPortCheck || portNumberRangeCheck ? 'red' : 'black'}
                                value={ApplicationData.serverPort}
                                maxLength="5"
                                onKeyPress={handleKeyPress}
                                onChange={e => handleData('serverPort', e.target.value)}
                            />
                        </FormControl>
                        {serverPortCheck && (
                            <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                The input cannot contain reserved port number.
                            </Alert>
                        )}
                        {portNumberError && (
                            <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                Port Number already exists. Please choose a unique Port Number.
                            </Alert>
                        )}
                        {portNumberRangeCheck && (
                            <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                Port Number is out of the valid range.
                            </Alert>
                        )}
                    </div>
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
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                backgroundColor: '#ffc9c9',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleColorClick('#ffc9c9')}
                        ></div>
                        <div
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                backgroundColor: '#b2f2bb',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleColorClick('#b2f2bb')}
                        ></div>
                        <div
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                backgroundColor: '#a5d8ff',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleColorClick('#a5d8ff')}
                        ></div>
                        <div
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                backgroundColor: '#ffec99',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleColorClick('#ffec99')}
                        ></div>
                        <div
                            style={{
                                width: '30px',
                                height: '30px',
                                border: '1px solid #cfcfcf',
                                borderRadius: '50%',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleColorClick('#fff')}
                        ></div>
                    </div>
                    <Button
                        onClick={() => !duplicateApplicationNameError && onSubmit(ApplicationData)}
                        style={{ display: 'block', margin: '0 auto' }}
                        isDisabled={isSubmitDisabled || appNameCheck || serverPortCheck || portNumberError || portNumberRangeCheck}
                    >
                        Save
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default GatewayModal;
