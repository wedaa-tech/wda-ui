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
    Tooltip,
} from '@chakra-ui/react';
import validatePortNumber from '../../utils/portValidation';
import Editor from '@monaco-editor/react';
import { FaSync } from 'react-icons/fa';
import { useKeycloak } from '@react-keycloak/web';
import './ModalStyle.css';

const ApplicationModal = ({
    nodeType,
    isOpen,
    onClose,
    onSubmit,
    CurrentNode,
    uniqueApplicationNames,
    uniquePortNumbers,
    handleColorClick,
}) => {
    const UiInitialState = {
        label: '',
        applicationName: '',
        clientFramework: 'no',
        applicationFramework: '',
        packageName: '',
        serverPort: '',
        withExample: 'false',
        applicationType: 'gateway',
        color: '#fff',
        theme: '',
        ...CurrentNode,
    };
    const GatewayInitialState = {
        label: '',
        applicationName: '',
        applicationFramework: 'java',
        packageName: '',
        serverPort: '',
        applicationType: 'gateway',
        color: '#fff',
        ...CurrentNode,
    };
    const GroupInitialState = {
        label: 'Group',
        type: 'Group',
        color: '#fff',
        ...CurrentNode,
    };
    const validFrameworksAndDBs = [{ framework: 'spring', dbType: 'postgresql' }];
    const editorInstruction =
        '/* Below DBML is auto-generated based on component name and description.\nThis can be edited directly or regenerated for updated description.*/\n\n';
    const dbmlData = CurrentNode?.dbmlData ? editorInstruction + CurrentNode?.dbmlData : editorInstruction;
    const ServiceInitialState = {
        label: '',
        applicationName: '',
        applicationFramework: '',
        packageName: '',
        serverPort: '',
        applicationType: 'microservice',
        color: '#fff',
        description: '',
        ...CurrentNode,
        dbmlData,
    };
    const { initialized, keycloak } = useKeycloak();
    const [isLoading, setIsLoading] = useState(false);
    const [UiData, setUiDataData] = useState(UiInitialState);
    const [GatewayData, setGatewayData] = useState(GatewayInitialState);
    const [ServiceData, setServiceData] = useState(ServiceInitialState);
    const [groupData, setGroupData] = useState(GroupInitialState);
    const [duplicateApplicationNameError, setDuplicateApplicationNameError] = useState(false);
    const [portValidationError, setPortValidationError] = useState({});
    const [clientFrameworkError, setClientFrameworkError] = useState(false);
    const [applicationFrameworkError, setApplicationFrameworkError] = useState(false);
    const [themeError, setThemeError] = useState(false);
    const isEmptyUiSubmit =
        UiData.applicationName === '' || (UiData.applicationFramework === 'ui' && UiData.packageName === '') || UiData.serverPort === '';

    let appNameCheck = false;
    if (nodeType === 'UI') {
        appNameCheck = UiData.applicationName && !/^[a-zA-Z](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$/g.test(UiData.applicationName);
    } else if (nodeType === 'Service') {
        appNameCheck = ServiceData.applicationName && !/^[a-zA-Z](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$/g.test(ServiceData.applicationName);
    } else if (nodeType === 'Gateway') {
        appNameCheck = GatewayData.applicationName && !/^[a-zA-Z](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$/g.test(GatewayData.applicationName);
    }

    const packageNameCheck =
        nodeType === 'Gateway' && GatewayData.packageName && !/^[a-zA-Z](?:[a-zA-Z0-9_.-]*[a-zA-Z0-9])?$/g.test(GatewayData.packageName)
            ? true
            : nodeType === 'Service' &&
              ServiceData.packageName &&
              !/^[a-zA-Z](?:[a-zA-Z0-9_.-]*[a-zA-Z0-9])?$/g.test(ServiceData.packageName)
            ? true
            : false;

    const isSubmitDisabled = GatewayData.applicationName === '' || GatewayData.packageName === '' || GatewayData.serverPort === '';
    const isSubmitDisable = ServiceData.applicationName === '' || ServiceData.packageName === '' || ServiceData.serverPort === '';
    const groupNameCheck = !groupData.label;
    const [descriptionError, setDescriptionError] = useState(false);

    useEffect(() => {
        const handleDeleteKeyPress = event => {
            if (
                isOpen &&
                (event.key === 'Backspace' || event.key === 'Delete') &&
                event.target.tagName !== 'INPUT' &&
                (nodeType !== 'UI' || nodeType !== 'Service' || event.target.tagName !== 'TEXTAREA')
            ) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleDeleteKeyPress);
        return () => {
            window.removeEventListener('keydown', handleDeleteKeyPress);
        };
    }, [isOpen, onClose]);

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
        if (nodeType === 'UI' && UiData.applicationFramework === '') {
            setApplicationFrameworkError(true);
            return false;
        } else if (nodeType === 'Service' && ServiceData.applicationFramework === '') {
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
    const descriptionValidation = () => {
        const regex = /^(\s*\S+\s+){4,}\s*\S*$/;
        const description = ServiceData.description;
        if (!description || description.trim() === '' || regex.test(description.trim())) {
            setDescriptionError(false);
            return true;
        }
        setDescriptionError(true);
        return false;
    };
    const isValidFrameworkAndDB = validFrameworksAndDBs.some(
        combination => combination.framework === CurrentNode?.applicationFramework && combination.dbType === CurrentNode?.prodDatabaseType,
    );
    const fetchDbmlData = async () => {
        if (initialized && keycloak.authenticated && descriptionValidation()) {
            setIsLoading(true);

            await fetch(process.env.REACT_APP_AI_CORE_URL + '/dbml', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
                body: JSON.stringify({
                    name: ServiceData.applicationName,
                    description: ServiceData?.description,
                }),
            })
                .then(response => {
                    setIsLoading(false);
                    if (!response.ok) {
                        throw new Error('Failed to add DBML script to service');
                    }
                    return response.json();
                })
                .then(data => {
                    setServiceData(prev => ({
                        ...prev,
                        dbmlData: editorInstruction + data.dbml,
                    }));
                })
                .catch(error => {
                    console.error('Error adding DBML script to service:', error);
                });
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
    const handleSubmit = () => {
        if (ServiceData?.dbmlData) {
            let dbmlScript = ServiceData.dbmlData;
            if (dbmlScript.startsWith(editorInstruction)) {
                ServiceData.dbmlData = dbmlScript.replace(editorInstruction, '');
            }
        }
        onSubmit(ServiceData);
    };

    const handleData = (column, value) => {
        if (nodeType === 'UI') {
            if (column === 'applicationName') {
                validateName(value);
                setUiDataData(prev => ({
                    ...prev,
                    [column]: value,
                }));
            } else if (column === 'serverPort') {
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
        } else if (nodeType === 'Gateway') {
            if (column === 'applicationName') {
                validateName(value);
                setGatewayData(prev => ({
                    ...prev,
                    [column]: value,
                }));
            } else if (column === 'serverPort') {
                const validationErrors = validatePortNumber(value, uniquePortNumbers, CurrentNode?.serverPort);
                setPortValidationError(validationErrors);
                setGatewayData(prev => ({
                    ...prev,
                    [column]: value,
                    serverPort: value,
                }));
            } else {
                setGatewayData(prev => ({
                    ...prev,
                    [column]: value,
                }));
            }
        } else if (nodeType === 'Group' || nodeType === 'Dummy') {
            if (column === 'label') {
                setGroupData(prev => ({
                    ...prev,
                    [column]: value,
                    groupName: value,
                }));
            } else {
                setGroupData(prev => ({
                    ...prev,
                    [column]: value,
                }));
            }
        } else if (nodeType === 'Service') {
            if (column === 'applicationName') {
                validateName(value);
                setServiceData(prev => ({
                    ...prev,
                    [column]: value,
                }));
            } else if (column === 'serverPort') {
                const validationErrors = validatePortNumber(value, uniquePortNumbers, CurrentNode?.serverPort);
                setPortValidationError(validationErrors);
                setServiceData(prev => ({
                    ...prev,
                    [column]: value,
                    serverPort: value,
                }));
            } else if (column === 'applicationFramework') {
                if (value.length > 0) {
                    setApplicationFrameworkError(false);
                    setServiceData(prev => ({
                        ...prev,
                        [column]: value,
                    }));
                }
            } else if (column === 'description') {
                setServiceData(prev => ({
                    ...prev,
                    [column]: value,
                }));
            } else {
                setServiceData(prev => ({
                    ...prev,
                    [column]: value,
                }));
            }
        }
    };

    return (
        <Modal isOpen={isOpen} size={isValidFrameworkAndDB ? '6xl' : ''} onClose={() => onClose(false)}>
            <ModalContent
                style={{
                    position: 'absolute',
                    top: '100px',
                    right: isValidFrameworkAndDB ? '10%' : '10px',
                    transform: 'translate(-50%, -50%)',
                    width: isValidFrameworkAndDB ? '90%' : '300px',
                }}
            >
                {nodeType === 'UI' ? (
                    <ModalHeader style={{ textAlign: 'center' }}>User Interface</ModalHeader>
                ) : (
                    <ModalHeader style={{ textAlign: 'center' }}>{nodeType}</ModalHeader>
                )}
                <ModalCloseButton />
                <ModalBody>
                    <div
                        style={{
                            display: isValidFrameworkAndDB ? 'flex' : 'block',
                            flexDirection: 'row',
                            gap: isValidFrameworkAndDB ? '40px' : '0',
                        }}
                    >
                        <div style={{ flex: 0.5 }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: isValidFrameworkAndDB ? '15px' : '',
                                }}
                            >
                                {nodeType !== 'Group' && nodeType !== 'Dummy' && (
                                    <>
                                        <FormControl>
                                            <FormLabel>Label</FormLabel>
                                            <Input
                                                mb={4}
                                                variant="outline"
                                                id="label"
                                                placeholder="Display Name"
                                                borderColor={'black'}
                                                maxLength="32"
                                                value={
                                                    nodeType === 'UI'
                                                        ? UiData.label
                                                        : nodeType === 'Gateway'
                                                        ? GatewayData.label
                                                        : ServiceData.label
                                                }
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
                                                borderColor={
                                                    (duplicateApplicationNameError && !UiData.applicationName) ||
                                                    (duplicateApplicationNameError && !GatewayData.applicationName) ||
                                                    (duplicateApplicationNameError && !ServiceData.applicationName)
                                                        ? 'red'
                                                        : 'black'
                                                }
                                                maxLength="32"
                                                value={
                                                    nodeType === 'UI'
                                                        ? UiData.applicationName
                                                        : nodeType === 'Gateway'
                                                        ? GatewayData.applicationName
                                                        : ServiceData.applicationName
                                                }
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
                                    </>
                                )}
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
                                {(nodeType === 'Gateway' || nodeType === 'Service') && (
                                    <FormControl>
                                        <FormLabel className="required">Package Name</FormLabel>
                                        <Input
                                            mb={4}
                                            variant="outline"
                                            id="packagename"
                                            placeholder="com.example"
                                            borderColor={packageNameCheck ? 'red' : 'black'}
                                            maxLength="32"
                                            value={nodeType === 'Gateway' ? GatewayData.packageName : ServiceData.packageName}
                                            onChange={e => handleData('packageName', e.target.value)}
                                        />
                                    </FormControl>
                                )}
                                {packageNameCheck && (
                                    <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                        <AlertIcon style={{ width: '14px', height: '14px' }} />
                                        Enter a valid package name
                                    </Alert>
                                )}

                                {nodeType !== 'Group' && nodeType !== 'Dummy' && (
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
                                            value={
                                                nodeType === 'UI'
                                                    ? UiData.serverPort
                                                    : nodeType === 'Gateway'
                                                    ? GatewayData.serverPort
                                                    : ServiceData.serverPort
                                            }
                                            maxLength="5"
                                            onKeyPress={handleKeyPress}
                                            onChange={e => handleData('serverPort', e.target.value)}
                                        />
                                    </FormControl>
                                )}

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
                                {nodeType === 'UI' && UiData.applicationFramework !== 'docusaurus' && (
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

                                {(nodeType === 'Group' || nodeType === 'Dummy') && (
                                    <FormControl>
                                        <FormLabel>Name</FormLabel>
                                        <Input
                                            mb={3}
                                            variant="outline"
                                            id="groupName"
                                            placeholder="Display Name"
                                            borderColor={'black'}
                                            maxLength="32"
                                            value={groupData.label}
                                            onChange={e => handleData('label', e.target.value)}
                                        />
                                    </FormControl>
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
                                            border: UiData.color === '#ffc9c9' ? '2px solid #007bff' : '1px solid #cfcfcf',
                                        }}
                                        onClick={() => {
                                            handleData('color', '#ffc9c9');
                                            handleColorClick('#ffc9c9');
                                        }}
                                    ></div>
                                    <div
                                        className="color"
                                        style={{
                                            border: UiData.color === '#b2f2bb' ? '2px solid #007bff' : '1px solid #cfcfcf',
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
                                            border: UiData.color === '#a5d8ff' ? '2px solid #007bff' : '1px solid #cfcfcf',
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
                                            border: UiData.color === '#ffec99' ? '2px solid #007bff' : '1px solid #cfcfcf',
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
                                            border: UiData.color === '#fff' ? '2px solid #007bff' : '1px solid #cfcfcf',
                                            backgroundColor: '#fff',
                                        }}
                                        onClick={() => {
                                            handleData('color', '#fff');
                                            handleColorClick('rgba(255, 255, 255, 0)');
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        {isValidFrameworkAndDB && (
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '15px',
                                    }}
                                >
                                    <FormControl>
                                        <FormLabel>Description</FormLabel>
                                        <Textarea
                                            mb={4}
                                            variant="outline"
                                            id="description"
                                            placeholder="A small description about your service"
                                            borderColor={'black'}
                                            value={ServiceData.description}
                                            disabled={!(initialized && keycloak.authenticated)}
                                            backgroundColor={initialized && keycloak.authenticated ? 'white' : '#f2f2f2'}
                                            onChange={e => handleData('description', e.target.value)}
                                            style={{ height: '100px', overflowY: 'scroll' }}
                                        />
                                    </FormControl>
                                    {descriptionError && (
                                        <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                            <AlertIcon style={{ width: '14px', height: '14px' }} />
                                            Service description should contain at least 5 words.
                                        </Alert>
                                    )}
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
                                            <Tooltip
                                                label="Generate DBML Scripts"
                                                placement="left"
                                                bg="blue.500"
                                                color="white"
                                                borderRadius="md"
                                                fontSize="sm"
                                            >
                                                <IconButton
                                                    icon={<FaSync />}
                                                    isLoading={isLoading}
                                                    onClick={fetchDbmlData}
                                                    aria-label="Refresh"
                                                    variant="link"
                                                    colorScheme="blue"
                                                    style={{ position: 'relative', fontSize: '15px' }}
                                                    spin={isLoading}
                                                />
                                            </Tooltip>
                                        </FormLabel>

                                        <div
                                            style={{
                                                height: '250px',
                                                border: '1px solid black',
                                                borderRadius: '5px',
                                                padding: '5px',
                                                marginBottom: '10px',
                                                backgroundColor: initialized && keycloak.authenticated ? 'white' : '#FAFAFA',
                                                borderColor: initialized && keycloak.authenticated ? 'black' : 'grey',
                                                cursor: !(initialized && keycloak.authenticated) && 'not-allowed',
                                                position: 'relative',
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
                                                    value={ServiceData.dbmlData}
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

                    {nodeType === 'UI' && (
                        <>
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
                        </>
                    )}
                    {nodeType === 'Gateway' && (
                        <>
                            <Button
                                onClick={() => !duplicateApplicationNameError && onSubmit(GatewayData)}
                                style={{ display: 'block', margin: '0 auto' }}
                                isDisabled={
                                    isSubmitDisabled ||
                                    appNameCheck ||
                                    portValidationError.serverPortError ||
                                    portValidationError.portNumberError ||
                                    portValidationError.portRangeError
                                }
                            >
                                Save
                            </Button>
                        </>
                    )}
                    {(nodeType === 'Group' || nodeType === 'Dummy') && (
                        <>
                            <Button
                                onClick={() => onSubmit(groupData)}
                                style={{ display: 'block', margin: '0 auto' }}
                                isDisabled={groupNameCheck}
                            >
                                Save
                            </Button>
                        </>
                    )}
                    {nodeType === 'Service' && (
                        <>
                            <Button
                                onClick={() =>
                                    !duplicateApplicationNameError &&
                                    isApplicationFrameworkFilled() &&
                                    descriptionValidation() &&
                                    handleSubmit()
                                }
                                style={{ display: 'block', margin: '0 auto' }}
                                isDisabled={
                                    isSubmitDisable ||
                                    appNameCheck ||
                                    portValidationError.serverPortError ||
                                    portValidationError.portNumberError ||
                                    portValidationError.portRangeError ||
                                    applicationFrameworkError ||
                                    isLoading
                                }
                            >
                                Save
                            </Button>
                        </>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
export default ApplicationModal;
