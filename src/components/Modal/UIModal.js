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
    Textarea,
} from '@chakra-ui/react';
import validatePortNumber from '../../utils/portValidation';

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
        label: '',
        applicationName: '',
        clientFramework: 'no',
        applicationFramework: '',
        packageName: '',
        serverPort: '',
        withExample: 'false',
        applicationType: 'gateway',
        color:'#fff',
        theme: '',
        ...CurrentNode,
    };
    const [UiData, setUiDataData] = useState(IntialState);
    const [duplicateApplicationNameError, setDuplicateApplicationNameError] = useState(false);
    const [portValidationError, setPortValidationError] = useState({});
    const [clientFrameworkError, setClientFrameworkError] = useState(false);
    const [applicationFrameworkError, setApplicationFrameworkError] = useState(false);
    const [themeError, setThemeError] = useState(false);
    const isEmptyUiSubmit =
        UiData.applicationName === '' || (UiData.applicationFramework === 'ui' && UiData.packageName === '') || UiData.serverPort === '';

    const appNameCheck = UiData.applicationName && !/^[a-zA-Z](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$/g.test(UiData.applicationName);

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
        if (isDuplicateName && value.length > 0) {
            setDuplicateApplicationNameError(true);
            return false;
        } else {
            setDuplicateApplicationNameError(false);
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
            if (
                isOpen &&
                (event.key === 'Backspace' || event.key === 'Delete') &&
                event.target.tagName !== 'INPUT' &&
                event.target.tagName !== 'TEXTAREA'
            ) {
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
            // validatePortNumber(value);
            const validationErrors = validatePortNumber(value, uniquePortNumbers, CurrentNode?.serverPort);
            setPortValidationError(validationErrors);
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
            if (value.length > 0) {
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
            if (value.length > 0) {
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
                    top: '100px',
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
                            <FormLabel className="required">Component Name</FormLabel>
                            <Input
                                mb={4}
                                variant="outline"
                                id="applicationName"
                                placeholder="Component Name"
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
                        {UiData.applicationFramework === 'docusaurus' && (
                            <FormControl>
                                <FormLabel className="required">Theme</FormLabel>
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
                            <FormLabel className="required">Server Port</FormLabel>
                            <Input
                                mb={4}
                                variant="outline"
                                id="serverPort"
                                placeholder="Port number"
                                borderColor={
                                    portValidationError.serverPortError ||
                                    portValidationError.portNumberError ||
                                    portValidationError.portRangeError
                                        ? 'red'
                                        : 'black'
                                }
                                value={UiData.serverPort}
                                maxLength="5"
                                onKeyPress={handleKeyPress}
                                onChange={e => handleData('serverPort', e.target.value)}
                            />
                        </FormControl>

                        {portValidationError.portRequiredError && (
                            <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                {portValidationError.portRequiredError}
                            </Alert>
                        )}
                        {portValidationError.serverPortError && (
                            <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                {portValidationError.serverPortError}
                            </Alert>
                        )}
                        {portValidationError.portNumberError && (
                            <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                {portValidationError.portNumberError}
                            </Alert>
                        )}
                        {portValidationError.portRangeError && (
                            <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                {portValidationError.portRangeError}
                            </Alert>
                        )}
                        {UiData.applicationFramework !== 'docusaurus' && (
                            <FormControl>
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                    mb={4}
                                    variant="outline"
                                    id="label"
                                    placeholder="A small description"
                                    borderColor={'black'}
                                    maxLength="45"
                                    value={UiData.description}
                                    onChange={e => handleData('description', e.target.value)}
                                />
                            </FormControl>
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
                                border: UiData.color === '#ffc9c9' ? '2px solid #007bff' : '1px solid #cfcfcf',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                handleData('color', '#ffc9c9');
                                handleColorClick('#ffc9c9');
                            }}
                        ></div>
                        <div
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                border: UiData.color === '#b2f2bb' ? '2px solid #007bff' : '1px solid #cfcfcf',
                                backgroundColor: '#b2f2bb',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                handleData('color', '#b2f2bb');
                                handleColorClick('#b2f2bb');
                            }}
                        ></div>
                        <div
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                border: UiData.color === '#a5d8ff' ? '2px solid #007bff' : '1px solid #cfcfcf',
                                backgroundColor: '#a5d8ff',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                handleData('color', '#a5d8ff');
                                handleColorClick('#a5d8ff');
                            }}
                        ></div>
                        <div
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                border: UiData.color === '#ffec99' ? '2px solid #007bff' : '1px solid #cfcfcf',
                                backgroundColor: '#ffec99',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                handleData('color', '#ffec99');
                                handleColorClick('#ffec99');
                            }}
                        ></div>
                        <div
                            style={{
                                width: '30px',
                                height: '30px',
                                border: UiData.color === '#fff' ? '2px solid #007bff' : '1px solid #cfcfcf',
                                border: '1px solid #cfcfcf',
                                borderRadius: '50%',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                handleData('color', '#fff');
                                handleColorClick('rgba(255, 255, 255, 0)');
                            }}
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
                            portValidationError.serverPortError ||
                            portValidationError.portNumberError ||
                            portValidationError.portRangeError ||
                            clientFrameworkError ||
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
