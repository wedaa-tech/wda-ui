import React, { useEffect, useRef, useState } from 'react';
import db1 from '../assets/postgresql.png';
import db2 from '../assets/mongo.png';
import srv1 from '../assets/spring.png';
import srv2 from '../assets/go.png';
import ui1 from '../assets/react.png';
import ui2 from '../assets/angular.png';
import grp from '../assets/group.png';
import gateway from '../assets/cloud gateway.png';
import docs from '../assets/docusaurus.png';
import eurkea from '../assets/eureka.png';
import keycloakIcon from '../assets/keycloak.png';
import eck from '../assets/eck.png';
// import mini from "../assets/mini.png";
// import docker from "../assets/docker.png";
import './../App.css';
import {
    Input,
    FormLabel,
    Button,
    Checkbox,
    Tabs,
    TabList,
    TabPanel,
    TabPanels,
    Tab,
    VStack,
    Box,
    Flex,
    useColorModeValue,
    useTab,
    useToast,
    Tooltip,
    TabIndicator,
    IconButton,
    Divider,
} from '@chakra-ui/react';
import DeployModal from './Modal/DeployModal';
import { useKeycloak } from '@react-keycloak/web';
import { CloseIcon, HamburgerIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useLocation } from 'react-router-dom';
import ZoomableImageModalWrapper from './ZoomableImageModalWrapper';

const Sidebar = ({
    isUINodeEnabled,
    isGatewayNodeEnabled,
    Service_Discovery_Data,
    onSubmit,
    authenticationData,
    architectureName,
    isLoading,
    setIsLoading,
    serviceDiscoveryCount,
    authProviderCount,
    logManagementCount,
    saveMetadata,
    Togglesave,
    nodes,
    edges,
    isEmptyUiSubmit,
    isEmptyServiceSubmit,
    isEmptyGatewaySubmit,
    viewOnly = false,
    update,
    updated,
    setUpdated,
    triggerExit,
    isOpen = true,
    id,
}) => {
    const location = useLocation();
    const onDragStart = (event, nodeType, Name, metaData = '') => {
        event.dataTransfer.setData('Name', Name);
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('metaData', JSON.stringify(metaData));
        event.dataTransfer.effectAllowed = 'move';
    };
    const [selectedOption, setSelectedOption] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const toggleOption = option => {
        setSelectedOption(prevOption => (prevOption === option ? null : option));
    };
    var applicationName = architectureName || '';
    if (localStorage?.data) {
        applicationName = JSON.parse(localStorage.data).projectName;
    }
    const IntialState = {
        projectName: applicationName,
    };

    useEffect(() => {
        const images = [db1, db2, srv1, srv2, ui1, ui2, grp, gateway, docs, eurkea, keycloakIcon, eck];
        images.forEach(image => {
            new Image().src = image;
        });
    }, []);

    const [projectData, setprojectData] = useState(IntialState);
    useEffect(() => {
        if (triggerExit.onOk) {
            setprojectData({
                projectName: '',
            });
        }
    }, [triggerExit]);

    useEffect(() => {
        if (architectureName) {
            setprojectData(pd => ({
                ...pd,
                projectName: architectureName,
            }));
        }
    }, [architectureName]);

    const handleProjectData = (column, value) => {
        setUpdated(true);
        let data = {};
        if (localStorage?.data) data = JSON.parse(localStorage.data);
        data.projectName = value;
        data.updated = updated;
        localStorage.data = JSON.stringify(data);
        setprojectData(prev => ({ ...prev, [column]: value }));
    };
    const [showModal, setShowModal] = useState(false);
    const { initialized, keycloak } = useKeycloak();

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const checkNodeExists = Object.values(nodes).some(
        node => node.id.startsWith('Service') || node.id.startsWith('Gateway') || node.id.startsWith('UI'),
    );

    const [refArch, setRefArch] = useState([]);
    const [isContentVisible, setContentVisible] = useState(false);

    useEffect(() => {
        if (initialized) {
            fetch(process.env.REACT_APP_API_BASE_URL + '/refArchs', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
            })
                .then(response => response.json())
                .then(result => {
                    if (result?.data) {
                        const archs = structuredClone(result.data);
                        const publishedArchitectures = archs.filter(card => card.published === true);
                        setRefArch(publishedArchitectures);
                    }
                })
                .catch(error => console.error(error));
        }
    }, [initialized, keycloak]);

    useEffect(() => {
        setContentVisible(!viewOnly);
    }, [viewOnly]);

    const projectNameCheck = !/^[a-zA-Z](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$/g.test(projectData.projectName);
    const checkEdge = () => {
        let updatedEdges = { ...edges };
        let updatedNodes = { ...nodes };
        if (Object.keys(updatedNodes).length !== 0) {
            for (const key in updatedNodes) {
                let databaseCheck = updatedNodes[key];
                if (databaseCheck?.id?.startsWith('Database') && !databaseCheck?.data?.isConnected) {
                    return true;
                }
            }
        }
        if (Object.keys(updatedEdges).length !== 0) {
            for (const key in updatedEdges) {
                let edgeCheck = updatedEdges[key];
                if (edgeCheck?.target?.startsWith('Service') && !edgeCheck?.data?.framework) {
                    return true;
                }
            }
            return false;
        }
    };

    var isKeycloakConnected = () => {
        if (authProviderCount) {
            var authEdge = true;
            for (const key in edges) {
                const edge = edges[key];
                if (edge.target === 'authenticationType') {
                    authEdge = false;
                    break;
                }
            }
            return authEdge;
        } else return false;
    };

    var isRegistryConnected = () => {
        if (serviceDiscoveryCount) {
            var serviceRegistryEdge = true;

            for (const key in edges) {
                const edge = edges[key];
                if (edge.target === 'serviceDiscoveryType') {
                    serviceRegistryEdge = false;
                    break;
                }
            }
            return serviceRegistryEdge;
        } else return false;
    };

    var isEckConnected = () => {
        if (logManagementCount) {
            var logManagementEdge = true;
            for (const key in edges) {
                const edge = edges[key];
                if (edge.target === 'logManagement') {
                    logManagementEdge = false;
                    break;
                }
            }
            return logManagementEdge;
        } else return false;
    };

    var isDatabaseConnected = () => {
        var dbConnected = false;
        for (const key in nodes) {
            let databaseCheck = nodes[key];
            if (databaseCheck?.id?.startsWith('Database') && !databaseCheck?.data?.isConnected) {
                dbConnected = true;
                break;
            }
        }
        return dbConnected;
    };

    const toast = useToast({
        containerStyle: {
            width: '500px',
            maxWidth: '100%',
        },
    });

    const checkDisabled = () => {
        if (!checkNodeExists) {
            return { isValid: false, message: 'Drag and drop atleast one Application to generate the code' };
        }

        if (projectNameCheck) {
            return { isValid: false, message: 'Architecture name should be valid.' };
        }

        if (projectData.projectName === '') {
            return { isValid: false, message: 'Architecture name is empty.' };
        }

        if (isEmptyUiSubmit) {
            return { isValid: false, message: 'UI is not Configured. Click on the highlighted UI Node to Configure it.' };
        }

        if (isEmptyServiceSubmit) {
            return { isValid: false, message: 'Service is not Configured. Click on the highlighted Service node to Configure it.' };
        }

        if (isEmptyGatewaySubmit) {
            return { isValid: false, message: 'Gateway is not Configured. Click on the highlighted Gateway node to Configure it.' };
        }

        if (isKeycloakConnected()) {
            return { isValid: false, message: 'Create an edge connecting the node to Keycloak to enable the integration.' };
        }

        if (isRegistryConnected()) {
            return { isValid: false, message: 'Create an edge connecting the node to Service Registry to enable the integration.' };
        }

        if (isEckConnected()) {
            return { isValid: false, message: 'Create an edge connecting the node to Eck to enable the integration.' };
        }

        if (isDatabaseConnected()) {
            return { isValid: false, message: 'Create an edge connecting the node to Database to enable the integration.' };
        }

        return { isValid: true, message: 'Validation successful. Proceed to generate the application.' };
    };

    const toastIdRef = useRef();

    const handleButtonClick = () => {
        const { isValid, message } = checkDisabled();
        const errorMessage = message || 'Validation failed';
        toast.close(toastIdRef.current);
        toastIdRef.current = toast({
            title: errorMessage,
            status: isValid ? 'success' : 'error',
            duration: 3000,
            variant: 'left-accent',
            isClosable: true,
        });
        if (checkEdge()) return;
        if (!isValid) return;
        if (Object.keys(nodes).length === 1 && Object.values(nodes)[0]?.data?.applicationFramework === 'docusaurus') {
            setIsLoading(true);
        } else {
            setIsLoading(true);
        }
        onSubmit(projectData);
    };

    const handleToggleContent = () => {
        if (viewOnly)
            toast({
                title: 'View only mode enabled.',
                description: 'Click on Edit Button to start Editing.',
                status: 'error',
                duration: 1500,
                variant: 'left-accent',
                isClosable: true,
            });
        else {
            setContentVisible(!isContentVisible);
        }
    };

    const [summarizedArray, setSummarizedArray] = useState([]);

    const summarizeArray = dataArray => {
        const summary = {};

        dataArray.forEach(item => {
            let applicationType = item.data.applicationType;
            let applicationName = item.data.applicationName;
            const id = item.id;

            if (id === 'authenticationType') {
                applicationName = 'keycloak';
                applicationType = 'Authentication';
            }

            if (id === 'serviceDiscoveryType') {
                applicationName = 'eureka';
                applicationType = 'Service Discovery';
            }

            if (id === 'logManagementType') {
                applicationName = 'ELK Stack';
                applicationType = 'Log Management';
            }

            if (!summary[applicationType]) {
                summary[applicationType] = [];
            }

            summary[applicationType].push(applicationName);
        });

        // Convert the summary into an array of objects
        const summarized = Object.entries(summary).map(([applicationType, applicationNames]) => {
            return {
                applicationType,
                applicationNames,
            };
        });
        setSummarizedArray(structuredClone(summarized));
    };

    return (
        <Flex
            marginTop={'8px'}
            h="calc(100vh - 84px)"
            bg={useColorModeValue('white', 'gray.800')}
            borderColor={useColorModeValue('gray.900', 'gray.900')}
            zIndex={10}
            boxShadow="0 4px 12px rgba(0, 0, 0, 0.3)"
            borderRightRadius={'10px'}
            style={{
                transition: 'transform 0.3s',
                transform: isContentVisible ? 'translateX(0px)' : 'translateX(-300px)',
            }}
            maxWidth="303px"
            direction={'column'}
        >
            <Box p={'12px 20px 8px 20px'}>
                <FormLabel fontWeight="bold" style={{ margin: '0' }}>
                    Name
                </FormLabel>
                <Input
                    my={2}
                    variant="outline"
                    id="projectName"
                    borderColor={!projectData.projectName || projectNameCheck ? 'red' : '#CFCFCF'}
                    maxLength="32"
                    value={projectData.projectName}
                    onChange={e => handleProjectData('projectName', e.target.value)}
                ></Input>
            </Box>
            <IconButton
                onClick={handleToggleContent}
                variant="ghost"
                colorScheme="blackAlpha"
                mr="2"
                alignSelf="flex-end"
                position="absolute"
                top="10px"
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.3)"
                bg={useColorModeValue('white', 'gray.800')}
                left={'310px'}
                zIndex={100}
                icon={isContentVisible ? <CloseIcon /> : <HamburgerIcon />}
            />
            <Tabs
                minWidth={'300px'}
                onChange={index => setTabIndex(index)}
                h="calc(100vh - 140px)"
                index={tabIndex}
                colorScheme="black"
                transition={'hidden 0.2s'}
            >
                <TabList justifyContent="space-evenly">
                    <Tab fontSize={'12px'} fontWeight={'bold'}>
                        Components
                    </Tab>
                    <Tab fontSize={'12px'} fontWeight={'bold'}>
                        Reference <br />
                        Architectures
                    </Tab>
                </TabList>
                {/* <TabIndicator
                index={tabIndex}
                mt="-1.5px"
                height="2px"
                bg="blue.500"
                borderRadius="1px"
              /> */}
                <TabPanels height={'100%'}>
                    <TabPanel
                        style={{
                            minHeight: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            maxHeight: 'calc(100vh - 333px)',
                        }}
                    >
                        <div
                            className="sideBlock"
                            style={{
                                position: 'relative',
                                flex: '1',
                                overflowY: 'auto',
                                display: isContentVisible ? 'block' : 'none',
                            }}
                        >
                            {projectData.projectName && projectNameCheck && (
                                <span style={{ color: 'red', fontSize: '10px' }}>Enter a valid project name</span>
                            )}

                            <div className="description">
                                <h2
                                    style={{
                                        marginTop: '8px',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    Move components onto the canvas to create a design.
                                </h2>
                            </div>

                            {/* <div
                                className={`dndnode output ${isUINodeEnabled ? 'disabled' : ''}`}
                                onDragStart={event => onDragStart(event, 'default', 'UI')}
                                draggable={!isUINodeEnabled}
                                style={{
                                    backgroundColor: isUINodeEnabled ? '#CFCFCF' : '',
                                    cursor: isUINodeEnabled ? 'not-allowed' : '',
                                }}
                            >
                                UI
                            </div>
                            <div
                                className={`dndnode output ${isGatewayNodeEnabled ? 'disabled' : ''}`}
                                onDragStart={event => onDragStart(event, 'default', 'Gateway')}
                                draggable={!isGatewayNodeEnabled}
                                style={{
                                    backgroundColor: isGatewayNodeEnabled ? '#CFCFCF' : '',
                                    cursor: isGatewayNodeEnabled ? 'not-allowed' : '',
                                }}
                            >
                                Gateway
                            </div>

                            <div className="dndnode output" onDragStart={event => onDragStart(event, 'default', 'Service')} draggable>
                                Service
                            </div>
                            <div className="dndnode output" onDragStart={event => onDragStart(event, 'default', 'Group')} draggable>
                                Group
                            </div> */}
                            {/* <div style={{ borderBottom: '1px solid lightgrey' }}></div> */}
                            <Divider />
                            <h1
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingBottom: '3px',
                                    paddingTop: '3px',
                                    // justifyContent: 'space-between',
                                    // borderBottom: '1px solid lightgrey',
                                }}
                                onClick={() => toggleOption('UI')}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '  #f3f2f2 ')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                {selectedOption === 'UI' ? (
                                    <span style={{ color: 'lightgrey', fontSize: '12px', marginRight: '10px' }}>&#x25BC;</span>
                                ) : (
                                    <span style={{ color: 'lightgrey', fontSize: '12px', marginRight: '10px' }}>&#x25B6;</span>
                                )}{' '}
                                Client
                                {/* {selectedOption === 'UI' ? <span>&#x25B2;</span> : <span>&#x25BC;</span>} */}
                            </h1>
                            {selectedOption === 'UI' && (
                                <>
                                    <div
                                        className="selectorNode"
                                        onDragStart={event => onDragStart(event, 'default', 'UI_react')}
                                        draggable
                                        // onMouseEnter={e => (e.currentTarget.style.backgroundColor = '  #f3f2f2 ')}
                                        // onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                    >
                                        <img width="130px" style={{ margin: '-10px 0px 0px 2px' }} src={ui1} alt="reactlogo"></img>
                                    </div>
                                    <div
                                        className="selectorNode"
                                        onDragStart={event => onDragStart(event, 'default', 'UI_angular')}
                                        draggable
                                        // onMouseEnter={e => (e.currentTarget.style.backgroundColor = '  #f3f2f2 ')}
                                        // onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                    >
                                        <img width="130px" style={{ margin: '-20px 0px 0px 10px' }} src={ui2} alt="angularlogo"></img>
                                    </div>
                                    {/* <div style={{ borderBottom: '1px solid lightgrey' }}></div> */}
                                </>
                            )}
                            <Divider />
                            <h1
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingBottom: '3px',
                                    paddingTop: '3px',
                                    // justifyContent: 'space-between',
                                }}
                                onClick={() => toggleOption('Gateway')}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '  #f3f2f2 ')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                {selectedOption === 'Gateway' ? (
                                    <span style={{ color: 'lightgrey', fontSize: '12px', marginRight: '10px' }}>&#x25BC;</span>
                                ) : (
                                    <span style={{ color: 'lightgrey', fontSize: '12px', marginRight: '10px' }}>&#x25B6;</span>
                                )}
                                Gateway
                            </h1>
                            {selectedOption === 'Gateway' && (
                                <>
                                    <div className="selectorNode" onDragStart={event => onDragStart(event, 'default', 'Gateway')} draggable>
                                        <img width="180px" style={{ marginTop: '10px' }} src={gateway} alt="postgreslogo"></img>
                                    </div>
                                </>
                            )}
                            <Divider />

                            <h1
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingBottom: '3px',
                                    paddingTop: '3px',
                                    // justifyContent: 'space-between',
                                }}
                                onClick={() => toggleOption('Service')}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '  #f3f2f2 ')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                {selectedOption === 'Service' ? (
                                    <span style={{ color: 'lightgrey', fontSize: '12px', marginRight: '10px' }}>&#x25BC;</span>
                                ) : (
                                    <span style={{ color: 'lightgrey', fontSize: '12px', marginRight: '10px' }}>&#x25B6;</span>
                                )}
                                Service
                            </h1>
                            {selectedOption === 'Service' && (
                                <>
                                    <div
                                        className="selectorNode"
                                        onDragStart={event => onDragStart(event, 'default', 'Service_spring')}
                                        draggable
                                    >
                                        <img width="130px" style={{ margin: '-10px -50px -30px 5px' }} src={srv1} alt="springlogo"></img>
                                    </div>
                                    <div
                                        className="selectorNode"
                                        onDragStart={event => onDragStart(event, 'default', 'Service_gomicro')}
                                        draggable
                                    >
                                        <img width="100px" style={{ margin: '-30px 0px -20px 0px' }} src={srv2} alt="gologo"></img>
                                    </div>
                                </>
                            )}
                            <Divider />

                            <h1
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingBottom: '3px',
                                    paddingTop: '3px',
                                    // justifyContent: 'space-between',
                                }}
                                onClick={() => toggleOption('Documentation')}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '  #f3f2f2 ')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                {selectedOption === 'Documentation' ? (
                                    <span style={{ color: 'lightgrey', fontSize: '12px', marginRight: '10px' }}>&#x25BC;</span>
                                ) : (
                                    <span style={{ color: 'lightgrey', fontSize: '12px', marginRight: '10px' }}>&#x25B6;</span>
                                )}
                                Documentation
                            </h1>
                            {selectedOption === 'Documentation' && (
                                <>
                                    <div
                                        className="selectorNode"
                                        onDragStart={event => onDragStart(event, 'default', 'UI_docusaurus')}
                                        draggable
                                    >
                                        <img width="180px" style={{ margin: '0px 0px 0px -20px' }} src={docs} alt="docusauruslogo"></img>
                                    </div>
                                </>
                            )}
                            <Divider />

                            <h1
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingBottom: '3px',
                                    paddingTop: '3px',
                                    // justifyContent: 'space-between',
                                }}
                                onClick={() => toggleOption('Authentication')}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '  #f3f2f2 ')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                {selectedOption === 'Authentication' ? (
                                    <span style={{ color: 'lightgrey', fontSize: '12px', marginRight: '10px' }}>&#x25BC;</span>
                                ) : (
                                    <span style={{ color: 'lightgrey', fontSize: '12px', marginRight: '10px' }}>&#x25B6;</span>
                                )}
                                Authentication
                            </h1>
                            {selectedOption === 'Authentication' && (
                                <>
                                    <div
                                        className="selectorNode3"
                                        onDragStart={event => onDragStart(event, 'default', 'Auth_oauth2')}
                                        draggable
                                    >
                                        <img width="145px" src={keycloakIcon} alt="keycloaklogo"></img>
                                    </div>
                                </>
                            )}
                            <Divider />

                            <h1
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingBottom: '3px',
                                    paddingTop: '3px',
                                    // justifyContent: 'space-between',
                                }}
                                onClick={() => toggleOption('Database')}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '  #f3f2f2 ')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                {selectedOption === 'Database' ? (
                                    <span style={{ color: 'lightgrey', fontSize: '12px', marginRight: '10px' }}>&#x25BC;</span>
                                ) : (
                                    <span style={{ color: 'lightgrey', fontSize: '12px', marginRight: '10px' }}>&#x25B6;</span>
                                )}
                                Database
                            </h1>
                            {selectedOption === 'Database' && (
                                <>
                                    <div
                                        className="selectorNode"
                                        onDragStart={event => onDragStart(event, 'default', 'Database_postgresql')}
                                        draggable
                                    >
                                        <img width="145px" style={{ marginTop: '10px' }} src={db1} alt="postgreslogo"></img>
                                    </div>
                                    <div
                                        className="selectorNode"
                                        onDragStart={event => onDragStart(event, 'default', 'Database_mongodb')}
                                        draggable
                                    >
                                        <img width="145px" style={{ margin: '10px 0px 10px 15px' }} src={db2} alt="mongologo"></img>
                                    </div>
                                </>
                            )}
                            <Divider />

                            <h1>
                                <span
                                    style={{
                                        cursor: 'pointer',
                                        fontSize: '20px',
                                        // justifyContent: 'space-between',
                                        display: 'flex',
                                        alignItems: 'center',
                                        paddingBottom: '3px',
                                        paddingTop: '3px',
                                    }}
                                    onClick={() => toggleOption('serviceDiscovery')}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '  #f3f2f2 ')}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                >
                                    {selectedOption === 'serviceDiscovery' ? (
                                        <span style={{ color: 'lightgrey', fontSize: '12px', marginRight: '10px' }}>&#x25BC;</span>
                                    ) : (
                                        <span style={{ color: 'lightgrey', fontSize: '12px', marginRight: '10px' }}>&#x25B6;</span>
                                    )}
                                    Service Discovery{' '}
                                </span>
                            </h1>
                            <Divider />

                            {selectedOption === 'serviceDiscovery' && (
                                <>
                                    <div
                                        className="selectorNode1"
                                        onDragStart={event => onDragStart(event, 'default', 'Discovery_eureka')}
                                        draggable
                                    >
                                        <img width="80px" height="40px" src={eurkea} alt="eurekalogo"></img>
                                    </div>
                                </>
                            )}
                            <h1>
                                <span
                                    style={{
                                        cursor: 'pointer',
                                        fontSize: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        paddingBottom: '3px',
                                        paddingTop: '3px',
                                        // justifyContent: 'space-between',
                                    }}
                                    onClick={() => toggleOption('loadManagement')}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '  #f3f2f2 ')}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                >
                                    {selectedOption === 'loadManagement' ? (
                                        <span style={{ color: 'lightgrey', fontSize: '12px', marginRight: '10px' }}>&#x25BC;</span>
                                    ) : (
                                        <span style={{ color: 'lightgrey', fontSize: '12px', marginRight: '10px' }}>&#x25B6;</span>
                                    )}
                                    Log Management
                                </span>
                            </h1>
                            <Divider />

                            {selectedOption === 'loadManagement' && (
                                <>
                                    <div
                                        className="selectorNode6"
                                        onDragStart={event => onDragStart(event, 'default', 'Load_eck')}
                                        draggable
                                    >
                                        <img width="120px" src={eck} alt="ecklogo" />
                                    </div>
                                </>
                            )}

                            <h1
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingBottom: '3px',
                                    paddingTop: '3px',
                                    // justifyContent: 'space-between',
                                }}
                                onClick={() => toggleOption('Group')}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '  #f3f2f2 ')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                {selectedOption === 'Group' ? (
                                    <span style={{ color: 'lightgrey', fontSize: '12px', marginRight: '10px' }}>&#x25BC;</span>
                                ) : (
                                    <span style={{ color: 'lightgrey', fontSize: '12px', marginRight: '10px' }}>&#x25B6;</span>
                                )}
                                Group
                            </h1>
                            {selectedOption === 'Group' && (
                                <>
                                    <div className="selectorNode" onDragStart={event => onDragStart(event, 'default', 'Group')} draggable>
                                        <img
                                            width="250px"
                                            style={{ marginTop: '-10px', marginBottom: '-50px', marginLeft: '-40px' }}
                                            src={grp}
                                            alt="postgreslogo"
                                        ></img>
                                    </div>
                                </>
                            )}
                            <Divider />
                        </div>

                        <div
                            style={{
                                position: 'sticky',
                                bottom: '0',
                                marginTop: '35px',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        ></div>
                    </TabPanel>
                    <TabPanel>
                        <VStack spacing={5}>
                            {refArch.map(element => {
                                const metadata = structuredClone(element.metadata);
                                return (
                                    <Box
                                        width={'90%'}
                                        onDragStart={event => onDragStart(event, 'marketNode', 'marketNode', metadata)}
                                        draggable
                                    >
                                        <ZoomableImageModalWrapper
                                            imageUrl={element.imageUrl}
                                            description="Description of image 1."
                                            name={element.name}
                                        />
                                    </Box>
                                );
                            })}
                        </VStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            {initialized && keycloak.authenticated && (
                <Checkbox mx={4} size="md" colorScheme="blue" isChecked={saveMetadata} onChange={Togglesave}>
                    Save Project
                </Checkbox>
            )}
            <Button m={4} onClick={handleButtonClick} type="submit">
                Next
            </Button>
            {showModal && (
                <DeployModal
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    projectData={projectData}
                    onClose={handleCloseModal}
                    Service_Discovery_Data={Service_Discovery_Data}
                    update={update}
                />
            )}
        </Flex>
    );
};

export default Sidebar;
