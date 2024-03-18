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
    IconButton,
} from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import validatePortNumber from '../../utils/portValidation';
import { FaSync } from 'react-icons/fa';
import { useKeycloak } from '@react-keycloak/web';

const NewServiceModal = ({ isOpen, onClose, onSubmit, CurrentNode, handleColorClick, uniqueApplicationNames, uniquePortNumbers }) => {
    const IntialState = {
        label: '',
        applicationName: '',
        applicationFramework: '',
        packageName: '',
        serverPort: '',
        applicationType: 'microservice',
        color: '#fff',
        dbmlData: '',
        ...CurrentNode,
    };
    const { initialized, keycloak } = useKeycloak();
    const [ApplicationData, setApplicationData] = useState(IntialState);
    const [isLoading, setIsLoading] = useState(false);
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

    const [duplicateApplicationNameError, setDuplicateApplicationNameError] = useState(false);

    const [portValidationError, setPortValidationError] = useState({});

    const [applicationFrameworkError, setApplicationFrameworkError] = useState(false);

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

    const handleRefresh = () => {
        setIsLoading(true);
        // Make your API call here
        // Assuming fetchData is your API call function
        // fetchData().then(() => {
        //     setIsLoading(false);
        // }).catch(error => {
        //     console.error('Error fetching data:', error);
        //     setIsLoading(false);
        // });
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

    // const handleEditorChange= (value, event) => {
    //     setApplicationData(prev => ({
    //             ...prev,
    //             [column]: value,
    //         }));     }
    const handleData = (column, value) => {
        console.log(column, value);
        if (column === 'applicationName') {
            validateName(value);
            setApplicationData(prev => ({
                ...prev,
                [column]: value,
            }));
        } else if (column === 'serverPort') {
            const validationErrors = validatePortNumber(value, uniquePortNumbers, CurrentNode?.serverPort);
            setPortValidationError(validationErrors);
            setApplicationData(prev => ({
                ...prev,
                [column]: value,
                serverPort: value,
            }));
        } else if (column === 'applicationFramework') {
            if (value.length > 0) {
                setApplicationFrameworkError(false);
                setApplicationData(prev => ({
                    ...prev,
                    [column]: value,
                }));
            }
        } else {
            setApplicationData(prev => ({
                ...prev,
                [column]: value,
            }));
        }
    };

    const isSubmitDisabled =
        ApplicationData.applicationName === '' || ApplicationData.packageName === '' || ApplicationData.serverPort === '';

    const appNameCheck = ApplicationData.applicationName && !/^[a-zA-Z](?:[a-zA-Z]*)?$/g.test(ApplicationData.applicationName);

    const packageNameCheck = ApplicationData.packageName && !/^[a-zA-Z](?:[a-zA-Z0-9_.-]*[a-zA-Z0-9])?$/g.test(ApplicationData.packageName);

    const isApplicationFrameworkFilled = () => {
        if (ApplicationData.applicationFramework === '') {
            setApplicationFrameworkError(true);
            return false;
        } else {
            setApplicationFrameworkError(false);
            return true;
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            size={ApplicationData.applicationFramework === 'spring' && ApplicationData?.prodDatabaseType ? '6xl' : ''}
            onClose={() => onClose(false)}
        >
            <ModalContent
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: ApplicationData.applicationFramework === 'spring' && ApplicationData?.prodDatabaseType ? '20%' : '83%',
                    transform: 'translate(-50%, -50%)',
                    width: ApplicationData.applicationFramework === 'spring' && ApplicationData?.prodDatabaseType ? '90%' : '300px',
                }}
            >
                <ModalHeader style={{ textAlign: 'center' }}>Service</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div
                        style={{
                            display:
                                ApplicationData.applicationFramework === 'spring' && ApplicationData?.prodDatabaseType ? 'flex' : 'block',
                            flexDirection: 'row',
                            gap: ApplicationData.applicationFramework === 'spring' && ApplicationData?.prodDatabaseType ? '40px' : '0',
                        }}
                    >
                        {' '}
                        <div style={{ flex: 0.5 }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '15px',
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
                                    <FormLabel className="required">Component Name</FormLabel>
                                    <Input
                                        mb={4}
                                        variant="outline"
                                        id="applicationName"
                                        placeholder="Component Name"
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
                                    <FormLabel className="required">Package Name</FormLabel>
                                    <Input
                                        mb={4}
                                        variant="outline"
                                        id="packagename"
                                        placeholder="com.example"
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
                                    <FormLabel className="required">Server Port</FormLabel>
                                    <Input
                                        mb={4}
                                        variant="outline"
                                        id="serverport"
                                        placeholder="Port number"
                                        borderColor={
                                            portValidationError.serverPortError ||
                                            portValidationError.portNumberError ||
                                            portValidationError.portRangeError
                                                ? 'red'
                                                : 'black'
                                        }
                                        value={ApplicationData.serverPort}
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
                                <FormLabel>Background Color</FormLabel>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        marginTop: '-20px',
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
                                            // border: ApplicationData.color === '#ffc9c9' ? '1px solid white' : 'none',
                                            // boxShadow: ApplicationData.color === '#ffc9c9' ? '0px 0px 0px 2px #ffc9c9' : '',
                                            cursor: 'pointer',
                                            border: ApplicationData.color === '#ffc9c9' ? '2px solid #007bff' : '1px solid #cfcfcf',
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
                                            backgroundColor: '#b2f2bb',
                                            border: ApplicationData.color === '#b2f2bb' ? '2px solid #007bff' : '1px solid #cfcfcf',
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
                                            backgroundColor: '#a5d8ff',
                                            border: ApplicationData.color === '#a5d8ff' ? '2px solid #007bff' : '1px solid #cfcfcf',
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
                                            backgroundColor: '#ffec99',
                                            border: ApplicationData.color === '#ffec99' ? '2px solid #007bff' : '1px solid #cfcfcf',
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
                                            // border: '1px solid #cfcfcf',
                                            borderRadius: '50%',
                                            border: ApplicationData.color === '#fff' ? '2px solid #007bff' : '1px solid #cfcfcf',
                                            backgroundColor: '#fff',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                            handleData('color', '#fff');
                                            handleColorClick('rgba(255, 255, 255, 0)');
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        {ApplicationData.applicationFramework === 'spring' && ApplicationData?.prodDatabaseType && (
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '15px',
                                    }}
                                >
                                    {/* Your form controls */}
                                    <FormControl>
                                        <FormLabel>Description</FormLabel>
                                        <Textarea
                                            mb={4}
                                            variant="outline"
                                            id="description"
                                            placeholder="A small description about your service"
                                            borderColor={'black'}
                                            value={ApplicationData.description}
                                            disabled={!(initialized && keycloak.authenticated)}
                                            backgroundColor={initialized && keycloak.authenticated ? 'white' : '#f2f2f2'}
                                            onChange={e => handleData('description', e.target.value)}
                                            style={{ height: '100px', overflowY: 'scroll' }} // Adjusted height and added scrolling
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '0px',
                                            }}
                                        >
                                            <span>DBML Scripts</span>
                                            <IconButton
                                                icon={<FaSync />}
                                                isLoading={isLoading}
                                                onClick={handleRefresh}
                                                aria-label="Refresh"
                                                variant="link"
                                                colorScheme="blue"
                                                style={{ position: 'relative', fontSize: '15px' }}
                                                spin={isLoading}
                                            />
                                        </FormLabel>

                                        {/* <Textarea
                                        mb={2}
                                        variant="outline"
                                        id="umlData"
                                        placeholder="DBML scripts"
                                        borderColor={'black'}
                                        value={ApplicationData.umlData}
                                        onChange={e => handleData('umlData', e.target.value)}
                                        style={{
                                            height: '370px',
                                            overflowY: 'scroll',
                                            fontFamily: 'monospace',
                                            backgroundColor: '#f0f3f8',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            padding: '10px',
                                            fontSize: '16px',
                                        }}
                                    /> */}

                                        <div
                                            style={{
                                                height: '250px',
                                                border: '1px solid black',
                                                borderRadius: '5px',
                                                padding: '5px',
                                                marginBottom: '10px',
                                                backgroundColor: initialized && keycloak.authenticated ? 'white' : '#FAFAFA',
                                                borderColor:(initialized && keycloak.authenticated) ?"black": "grey",
                                                cursor: !(initialized && keycloak.authenticated) && 'not-allowed',
                                                position: 'relative', // Necessary for absolute positioning of the text
                                            }}
                                        >
                                            {!initialized ||
                                                (!keycloak.authenticated && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: '10%',
                                                            left: '18%',
                                                            transform: 'translate(-50%, -50%)',
                                                            color: '#E0E0E0',
                                                        }}
                                                    >
                                                        Please login to use this feature
                                                    </div>
                                                ))}

                                            {initialized && keycloak.authenticated && (
                                                <Editor
                                                    height="100%"
                                                    options={{
                                                        minimap: { enabled: false },
                                                        lineNumbers: 'on',
                                                        defaultLanguage: 'sql',
                                                    }}
                                                    defaultLanguage="sql"
                                                    // placeholder="DBML scripts"
                                                    defaultValue={ApplicationData.dbmlData}
                                                    onChange={value => {
                                                        handleData('dbmlData', value);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </FormControl>
                                </div>
                            </div>
                        )}
                    </div>
                    <Button
                        onClick={() => !duplicateApplicationNameError && isApplicationFrameworkFilled() && onSubmit(ApplicationData)}
                        style={{ display: 'block', margin: '0 auto' }}
                        isDisabled={
                            isSubmitDisabled ||
                            appNameCheck ||
                            portValidationError.serverPortError ||
                            portValidationError.portNumberError ||
                            portValidationError.portRangeError ||
                            applicationFrameworkError
                        }
                    >
                        Save
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default NewServiceModal;