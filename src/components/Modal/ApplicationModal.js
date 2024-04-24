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
import validatePortNumber from '../../utils/portValidation';
import Editor from '@monaco-editor/react';
import { FaSync } from 'react-icons/fa';
import { useKeycloak } from '@react-keycloak/web';
import './ModalStyle.css';
import setFieldErrors from '../../utils/setFieldErrors';
import { colors, UiFields, GatewayFields, ServiceFields, GroupFields, ServiceDescriptionField } from '../../utils/definingFileds';

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
    const [refreshEnabled, setRefreshEnabled] = useState(false);
    const { initialized, keycloak } = useKeycloak();
    const [isLoading, setIsLoading] = useState(false);
    const [UiData, setUiDataData] = useState(UiInitialState);
    const [GatewayData, setGatewayData] = useState(GatewayInitialState);
    const [ServiceData, setServiceData] = useState(ServiceInitialState);
    const [GroupData, setGroupData] = useState(GroupInitialState);
    const [duplicateApplicationNameError, setDuplicateApplicationNameError] = useState(false);
    const [portValidationError, setPortValidationError] = useState({});
    const [clientFrameworkError, setClientFrameworkError] = useState(false);
    const [applicationFrameworkError, setApplicationFrameworkError] = useState(false);
    const [themeError, setThemeError] = useState(false);
    const isEmptyUiSubmit =
        UiData.applicationName === '' || (UiData.applicationFramework === 'ui' && UiData.packageName === '') || UiData.serverPort === '';

    let appNameCheck = false;
    const dataToCheck = nodeType === 'UI' ? UiData : nodeType === 'Service' ? ServiceData : GatewayData;
    if (dataToCheck.applicationName && !/^[a-zA-Z](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$/g.test(dataToCheck.applicationName)) {
        appNameCheck = true;
    }

    const packageNameCheck =
        (nodeType === 'Gateway' ? GatewayData.packageName : ServiceData.packageName) &&
        !/^[a-zA-Z](?:[a-zA-Z0-9_.-]*[a-zA-Z0-9])?$/g.test(nodeType === 'Gateway' ? GatewayData.packageName : ServiceData.packageName);

    const isSubmitDisabled = GatewayData.applicationName === '' || GatewayData.packageName === '' || GatewayData.serverPort === '';
    const isSubmitDisable = ServiceData.applicationName === '' || ServiceData.packageName === '' || ServiceData.serverPort === '';
    const groupNameCheck = !GroupData.label;
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
        setDuplicateApplicationNameError(isDuplicateName);
        return !isDuplicateName;
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
        if (initialized && keycloak.authenticated && descriptionValidation() && refreshEnabled) {
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
            setRefreshEnabled(false);
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
                setRefreshEnabled(true);
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
                setRefreshEnabled(true);
            } else {
                setServiceData(prev => ({
                    ...prev,
                    [column]: value,
                }));
            }
        }
    };
    const typeOfNode = {
        UI: UiData,
        Service: ServiceData,
        Gateway: GatewayData,
        Group: GroupData,
        Dummy: GroupData,
    };
    const filteredUiFields =
        UiData.applicationFramework === 'docusaurus'
            ? UiFields.filter(field => field.key !== 'description')
            : UiFields.filter(field => field.key !== 'theme');

    setFieldErrors(UiFields, {
        duplicateApplicationNameError,
        appNameCheck,
        themeError,
        portValidationError,
    });
    setFieldErrors(GatewayFields, {
        duplicateApplicationNameError,
        appNameCheck,
        packageNameCheck,
        portValidationError,
    });
    setFieldErrors(ServiceFields, {
        duplicateApplicationNameError,
        appNameCheck,
        packageNameCheck,
        portValidationError,
    });
    setFieldErrors(ServiceDescriptionField, { descriptionError });

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
                                {nodeType === 'UI' && (
                                    <>
                                        {filteredUiFields.map(field => (
                                            <FormControl key={field.key}>
                                                <FormLabel
                                                    className={
                                                        field.key === 'applicationName' ||
                                                        field.key === 'serverPort' ||
                                                        field.key === 'theme'
                                                            ? 'required'
                                                            : ''
                                                    }
                                                >
                                                    {field.label}
                                                </FormLabel>
                                                {field.key === 'description' && UiData.applicationFramework !== 'docusaurus' ? (
                                                    <Textarea
                                                        mb={4}
                                                        variant="outline"
                                                        id={field.key}
                                                        placeholder={field.placeholder}
                                                        borderColor={'black'}
                                                        maxLength={field.maxLength}
                                                        value={UiData[field.key]}
                                                        onChange={e => handleData(field.key, e.target.value)}
                                                    />
                                                ) : field.key === 'theme' && UiData.applicationFramework === 'docusaurus' ? (
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
                                                        {field.options.map(option => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                ) : (
                                                    <Input
                                                        mb={4}
                                                        variant="outline"
                                                        id={field.key}
                                                        placeholder={field.placeholder}
                                                        borderColor={
                                                            field.key === 'serverPort'
                                                                ? portValidationError.message
                                                                    ? 'red'
                                                                    : 'black'
                                                                : field.key === 'applicationName'
                                                                ? field.error
                                                                    ? 'red'
                                                                    : 'black'
                                                                : 'black'
                                                        }
                                                        onKeyPress={field.key === 'serverPort' ? handleKeyPress : ''}
                                                        maxLength={field.maxLength}
                                                        value={UiData[field.key]}
                                                        onChange={e => handleData(field.key, e.target.value)}
                                                    />
                                                )}
                                                {field.error && (
                                                    <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                                        <AlertIcon style={{ width: '14px', height: '14px' }} />
                                                        {field.error}
                                                    </Alert>
                                                )}
                                            </FormControl>
                                        ))}
                                    </>
                                )}
                                {nodeType === 'Gateway' && (
                                    <>
                                        {GatewayFields.map(field => (
                                            <FormControl key={field.key}>
                                                <FormLabel
                                                    className={
                                                        field.key === 'applicationName' ||
                                                        field.key === 'serverPort' ||
                                                        field.key === 'packageName'
                                                            ? 'required'
                                                            : ''
                                                    }
                                                >
                                                    {field.label}
                                                </FormLabel>
                                                <Input
                                                    mb={4}
                                                    variant="outline"
                                                    id={field.key}
                                                    placeholder={field.placeholder}
                                                    borderColor={
                                                        field.key === 'serverPort'
                                                            ? portValidationError.message
                                                                ? 'red'
                                                                : 'black'
                                                            : field.key === 'applicationName'
                                                            ? field.error
                                                                ? 'red'
                                                                : 'black'
                                                            : field.key === 'packageName'
                                                            ? packageNameCheck
                                                                ? 'red'
                                                                : 'black'
                                                            : 'black'
                                                    }
                                                    onKeyPress={field.key === 'serverPort' ? handleKeyPress : ''}
                                                    maxLength={field.maxLength}
                                                    value={GatewayData[field.key]}
                                                    onChange={e => handleData(field.key, e.target.value)}
                                                />
                                                {field.error && (
                                                    <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                                        <AlertIcon style={{ width: '14px', height: '14px' }} />
                                                        {field.error}
                                                    </Alert>
                                                )}
                                            </FormControl>
                                        ))}
                                    </>
                                )}
                                {nodeType === 'Service' && (
                                    <>
                                        {ServiceFields.map(field => (
                                            <FormControl key={field.key}>
                                                <FormLabel
                                                    className={
                                                        field.key === 'applicationName' ||
                                                        field.key === 'serverPort' ||
                                                        field.key === 'packageName'
                                                            ? 'required'
                                                            : ''
                                                    }
                                                >
                                                    {field.label}
                                                </FormLabel>
                                                <Input
                                                    mb={4}
                                                    variant="outline"
                                                    id={field.key}
                                                    placeholder={field.placeholder}
                                                    borderColor={
                                                        field.key === 'serverPort'
                                                            ? portValidationError.message
                                                                ? 'red'
                                                                : 'black'
                                                            : field.key === 'applicationName'
                                                            ? field.error
                                                                ? 'red'
                                                                : 'black'
                                                            : field.key === 'packageName'
                                                            ? packageNameCheck
                                                                ? 'red'
                                                                : 'black'
                                                            : 'black'
                                                    }
                                                    onKeyPress={field.key === 'serverPort' ? handleKeyPress : ''}
                                                    maxLength={field.maxLength}
                                                    value={ServiceData[field.key]}
                                                    onChange={e => handleData(field.key, e.target.value)}
                                                />
                                                {field.error && (
                                                    <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                                        <AlertIcon style={{ width: '14px', height: '14px' }} />
                                                        {field.error}
                                                    </Alert>
                                                )}
                                            </FormControl>
                                        ))}
                                    </>
                                )}
                                {(nodeType === 'Group' || nodeType === 'Dummy') && (
                                    <>
                                        {GroupFields.map(field => (
                                            <FormControl key={field.key}>
                                                <FormLabel>{field.label}</FormLabel>
                                                <Input
                                                    mb={3}
                                                    variant="outline"
                                                    id={field.key}
                                                    placeholder={field.placeholder}
                                                    borderColor={'black'}
                                                    maxLength={field.maxLength}
                                                    value={GroupData[field.key]}
                                                    onChange={e => handleData(field.key, e.target.value)}
                                                />
                                            </FormControl>
                                        ))}
                                    </>
                                )}
                                {nodeType && (
                                    <>
                                        <FormLabel>Background Color</FormLabel>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                marginBottom: '20px',
                                                gap: '15px',
                                            }}
                                        >
                                            {colors.map((color, index) => (
                                                <div
                                                    key={index}
                                                    className="color"
                                                    style={{
                                                        backgroundColor: color,
                                                        border:
                                                            typeOfNode[nodeType].color === color
                                                                ? '2px solid #007bff'
                                                                : '1px solid #cfcfcf',
                                                    }}
                                                    onClick={() => {
                                                        handleData('color', color);
                                                        handleColorClick(color);
                                                    }}
                                                ></div>
                                            ))}
                                        </div>
                                    </>
                                )}
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
                                    {ServiceDescriptionField.map(field => (
                                        <FormControl key={field.key}>
                                            <FormLabel>{field.label}</FormLabel>
                                            <Textarea
                                                mb={4}
                                                variant="outline"
                                                id={field.key}
                                                placeholder={field.placeholder}
                                                borderColor={'black'}
                                                value={ServiceData[field.key]}
                                                disabled={!(initialized && keycloak.authenticated)}
                                                backgroundColor={initialized && keycloak.authenticated ? 'white' : '#f2f2f2'}
                                                onChange={e => handleData(field.key, e.target.value)}
                                                style={{ height: '100px', overflowY: 'scroll' }}
                                            />
                                            {field.error && (
                                                <Alert status="error" padding="4px" fontSize="12px" borderRadius="3px" mb={2}>
                                                    <AlertIcon style={{ width: '14px', height: '14px' }} />
                                                    {field.error}
                                                </Alert>
                                            )}
                                        </FormControl>
                                    ))}
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
                                                onClick={fetchDbmlData}
                                                aria-label="Refresh"
                                                variant="link"
                                                colorScheme="blue"
                                                style={{ position: 'relative', fontSize: '15px' }}
                                                spin={isLoading}
                                            />
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
                                onClick={() => !duplicateApplicationNameError && isThemeFilled() && onSubmit(UiData)}
                                style={{ display: 'block', margin: '0 auto' }}
                                isDisabled={
                                    isEmptyUiSubmit ||
                                    appNameCheck ||
                                    portValidationError.message ||
                                    clientFrameworkError ||
                                    applicationFrameworkError ||
                                    themeError ||
                                    duplicateApplicationNameError
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
                                    portValidationError.message ||
                                    duplicateApplicationNameError ||
                                    packageNameCheck
                                }
                            >
                                Save
                            </Button>
                        </>
                    )}
                    {(nodeType === 'Group' || nodeType === 'Dummy') && (
                        <>
                            <Button
                                onClick={() => onSubmit(GroupData)}
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
                                onClick={() => !duplicateApplicationNameError && descriptionValidation() && handleSubmit()}
                                style={{ display: 'block', margin: '0 auto' }}
                                isDisabled={
                                    isSubmitDisable ||
                                    appNameCheck ||
                                    portValidationError.message ||
                                    applicationFrameworkError ||
                                    isLoading ||
                                    duplicateApplicationNameError ||
                                    packageNameCheck
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
