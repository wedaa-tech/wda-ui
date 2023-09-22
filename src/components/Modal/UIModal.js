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

const UiDataModal = ({
    isOpen,
    onClose,
    onSubmit,
    CurrentNode,
    uniqueApplicationNames,
    uniquePortNumbers,
    handleColorClick,
    applicationData,
}) => {
    const IntialState = {
        label: 'UI',
        applicationName: '',
        clientFramework: 'no',
        applicationFramework: '',
        packageName: '',
        serverPort: '',
        withExample: 'false',
        applicationType: 'gateway',
        theme: '',
        ...CurrentNode,
    };
    const [UiData, setUiDataData] = useState(IntialState);
    const [duplicateApplicationNameError, setDuplicateApplicationNameError] = useState(false);
    const [portNumberError, setPortNumberError] = useState(false);
    const [clientFrameworkError, setClientFrameworkError] = useState(false);
    const [applicationFrameworkError, setApplicationFrameworkError] = useState(false);
    const [themeError, setThemeError] = useState(false);
    const isEmptyUiSubmit =
        UiData.applicationName === '' ||
        // (UiData.applicationFramework === 'ui' && UiData.packageName === '') ||
        UiData.serverPort === '';

    const reservedPorts = ['5601', '9200', '15021', '20001', '3000', '8080'];
    const serverPortCheck = UiData.serverPort && reservedPorts.includes(UiData.serverPort);

    const portNumberRangeCheck = UiData.serverPort && (Number(UiData.serverPort) < 1024 || Number(UiData.serverPort) > 65535);

    const appNameCheck = UiData.applicationName && !/^[a-zA-Z](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$/g.test(UiData.applicationName);

    // const packageNameCheck = UiData.packageName && !/^[a-zA-Z](?:[a-zA-Z0-9_.-]*[a-zA-Z0-9])?$/g.test(UiData.packageName);

    const labelCheck = () => UiData.label.trim() === '';

    const isClientFrameworkFilled = () => {
        if (UiData.applicationFramework === 'ui' && UiData.clientFramework === 'no') {
            setClientFrameworkError(true);
            return false;
        } else {
            setClientFrameworkError(false);
            return true;
        }
    };

    const isApplicationFrameworkFilled = () => {
        if (UiData.applicationFramework === '') {
            setApplicationFrameworkError(true);
            return false;
        } else {
            setApplicationFrameworkError(false);
            return true;
        }
    };

    const isThemeFilled = () => {
        if (UiData.applicationFramework === 'docusaurus' && UiData.theme === '') {
            setThemeError(true);
            return false;
        } else {
            setThemeError(false);
            return true;
        }
    };

    const validateName = value => {
        const currentApplicationName = CurrentNode?.applicationName;
        const isDuplicateName = uniqueApplicationNames.includes(value) && value !== currentApplicationName;
        if (isDuplicateName && value !== '') {
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
        if (isDuplicatePort && value !== '') {
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
        if (column === 'applicationName') {
            validateName(value);
            setUiDataData(prev => ({
                ...prev,
                [column]: value,
            }));
        } else if (column === 'serverPort') {
            validatePortNumber(value);
            setUiDataData(prev => ({
                ...prev,
                [column]: value,
                serverPort: value,
            }));
        } else if (column === 'clientFramework') {
            if (value !== 'no') {
                setClientFrameworkError(false);
                setUiDataData(prev => ({
                    ...prev,
                    [column]: value,
                }));
            }
        } else if (column === 'applicationFramework') {
            if (value !== '') {
                setApplicationFrameworkError(false);
                if (value === 'ui') {
                    setThemeError(false);
                } else if (value === 'docusaurus') {
                    setClientFrameworkError(false);
                }
                setUiDataData(prev => ({
                    ...prev,
                    [column]: value,
                }));
            }
        } else if (column === 'theme') {
            if (value !== '') {
                setThemeError(false);
                setUiDataData(prev => ({
                    ...prev,
                    [column]: value,
                }));
            }
        } else {
            setUiDataData(prev => ({
                ...prev,
                [column]: value,
            }));
        }
    };

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
                <ModalHeader style={{ textAlign: 'center' }}>User Interface</ModalHeader>
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
                            <FormLabel>Application name</FormLabel>
                            <Input
                                mb={4}
                                variant="outline"
                                id="applicationName"
                                placeholder="Name"
                                borderColor={duplicateApplicationNameError && !UiData.applicationName ? 'red' : 'black'}
                                maxLength="32"
                                value={UiData.applicationName}
                                onChange={e => handleData('applicationName', e.target.value)}
                            />
                            {duplicateApplicationNameError && (
                                <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                    <AlertIcon style={{ width: '14px', height: '14px' }} />
                                    Application name already exists. Please choose a unique name.
                                </Alert>
                            )}
                            {appNameCheck && (
                                <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                    <AlertIcon style={{ width: '14px', height: '14px' }} />
                                    Application Name should not contain -, _ or numbers.
                                </Alert>
                            )}
                        </FormControl>
                        <FormControl>
                            <FormLabel>Label</FormLabel>
                            <Input
                                mb={4}
                                variant="outline"
                                id="label"
                                placeholder="Display Name"
                                borderColor={'black'}
                                maxLength="32"
                                value={UiData.label}
                                onChange={e => handleData('label', e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Application Framework</FormLabel>
                            <Select
                                mb={4}
                                variant="outline"
                                id="applicationFramework"
                                borderColor={applicationFrameworkError ? 'red' : 'black'}
                                value={UiData.applicationFramework}
                                onChange={e => handleData('applicationFramework', e.target.value)}
                            >
                                <option value="" disabled>
                                    Select an option
                                </option>
                                <option value="ui" disabled={applicationData.ui}>
                                    UI
                                </option>
                                <option value="docusaurus" disabled={applicationData.docusaurus}>
                                    Docusaurus
                                </option>
                            </Select>
                        </FormControl>
                        {applicationFrameworkError && (
                            <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                Select a Valid Application Framework.
                            </Alert>
                        )}
                        {UiData.applicationFramework === 'ui' && (
                            <FormControl>
                                <FormLabel>Client Framework</FormLabel>
                                <Select
                                    mb={4}
                                    variant="outline"
                                    id="clientFramework"
                                    borderColor={clientFrameworkError ? 'red' : 'black'}
                                    value={UiData.clientFramework}
                                    onChange={e => handleData('clientFramework', e.target.value)}
                                >
                                    <option value="no" disabled>
                                        Select an option
                                    </option>
                                    <option value="react">React</option>
                                    <option value="angular">Angular</option>
                                </Select>
                            </FormControl>
                        )}
                        {UiData.applicationFramework === 'ui' && clientFrameworkError && (
                            <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                Select a Valid Client Framework.
                            </Alert>
                        )}
                        {/* {UiData.applicationFramework === 'ui' && (
                            <FormControl>
                                <FormLabel>Package Name</FormLabel>
                                <Input
                                    mb={4}
                                    variant="outline"
                                    id="packageName"
                                    placeholder="packageName"
                                    borderColor={!UiData.packageName ? 'red' : 'black'}
                                    maxLength="32"
                                    value={UiData.packageName}
                                    onChange={e => handleData('packageName', e.target.value)}
                                />
                            </FormControl>
                        )} */}
                        {/* {packageNameCheck && (
                            <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                Enter a valid package name
                            </Alert>
                        )} */}
                        {UiData.applicationFramework === 'docusaurus' && (
                            <FormControl>
                                <FormLabel>Theme</FormLabel>
                                <Select
                                    mb={4}
                                    variant="outline"
                                    id="clientFramework"
                                    borderColor={themeError ? 'red' : 'black'}
                                    value={UiData.theme}
                                    onChange={e => handleData('theme', e.target.value)}
                                >
                                    <option value="" disabled>
                                        Select an option
                                    </option>
                                    <option value="default">Default</option>
                                    <option value="profile">Profile</option>
                                </Select>
                            </FormControl>
                        )}
                        {UiData.applicationFramework === 'docusaurus' && themeError && (
                            <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                Select a Theme.
                            </Alert>
                        )}
                        <FormControl>
                            <FormLabel>Server Port</FormLabel>
                            <Input
                                mb={4}
                                variant="outline"
                                id="serverPort"
                                placeholder="Port number"
                                borderColor={portNumberError || serverPortCheck || portNumberRangeCheck ? 'red' : 'black'}
                                value={UiData.serverPort}
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
                        onClick={() =>
                            !duplicateApplicationNameError &&
                            isApplicationFrameworkFilled() &&
                            isClientFrameworkFilled() &&
                            isThemeFilled() &&
                            onSubmit(UiData)
                        }
                        style={{ display: 'block', margin: '0 auto' }}
                        isDisabled={
                            isEmptyUiSubmit ||
                            appNameCheck ||
                            serverPortCheck ||
                            portNumberError ||
                            portNumberRangeCheck ||
                            clientFrameworkError ||
                            labelCheck() ||
                            applicationFrameworkError ||
                            themeError
                        }
                    >
                        Save
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
export default UiDataModal;
