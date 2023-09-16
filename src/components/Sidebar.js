import React, { useEffect, useState } from 'react';
import db1 from '../assets/postgresql.png';
import db2 from '../assets/mongo.png';
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
} from '@chakra-ui/react';
import DeployModal from './Modal/DeployModal';
import { useKeycloak } from '@react-keycloak/web';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useLocation } from 'react-router-dom';
import ZoomableImageModalWrapper from './ZoomableImageModalWrapper';

const Sidebar = ({
    Service_Discovery_Data,
    onSubmit,
    authenticationData,
    isLoading,
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
    var applicationName = '';
    if (location?.state) applicationName = location.state.projectName;
    else if (localStorage?.data) {
        applicationName = JSON.parse(localStorage.data).projectName;
    }
    const IntialState = {
        projectName: applicationName,
    };

    const [projectData, setprojectData] = useState(IntialState);
    useEffect(() => {
        if (triggerExit.onOk) {
            setprojectData({
                projectName: '',
            });
        }
    }, [triggerExit]);

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

    const handleButtonClick = () => {
        setShowModal(true);
    };
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
            fetch(process.env.REACT_APP_API_BASE_URL + '/api/refArchs', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
            })
                .then(response => response.json())
                .then(result => {
                    if (result?.result) {
                        const archs = structuredClone(result.result);
                        setRefArch(archs);
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

    const toast = useToast({
        containerStyle: {
            width: '500px',
            maxWidth: '100%',
        },
    });

    const checkDisabled = () => {
        if (
            !checkNodeExists ||
            !authenticationData ||
            projectNameCheck ||
            projectData.projectName === '' ||
            isEmptyUiSubmit === true ||
            isEmptyServiceSubmit === true ||
            isEmptyGatewaySubmit === true
        )
            return true;
        else return false;
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

    return (
        <>
            <Flex
                position="absolute"
                top="70px"
                h="calc(100vh - 84px)"
                w="300px"
                bg={useColorModeValue('white', 'gray.800')}
                borderColor={useColorModeValue('gray.900', 'gray.900')}
                zIndex={1}
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.3)"
                borderRightRadius={'10px'}
                style={{
                    transition: 'transform 0.3s',
                    transform: isContentVisible ? 'translateX(0px)' : 'translateX(-300px)',
                }}
                maxWidth="300px"
            >
                <Button
                    onClick={handleToggleContent}
                    variant="ghost"
                    mr="2"
                    alignSelf="flex-end"
                    position="absolute"
                    top="10px"
                    boxShadow="0 4px 12px rgba(0, 0, 0, 0.3)"
                    bg={useColorModeValue('white', 'gray.800')}
                    left={'310px'}
                    zIndex={100}
                >
                    {isContentVisible ? <CloseIcon /> : <HamburgerIcon />}
                </Button>
                <Tabs
                    minWidth={'300px'}
                    onChange={index => setTabIndex(index)}
                    h="calc(100vh - 140px)"
                    index={tabIndex}
                    colorScheme="blue"
                    hidden={!isContentVisible}
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
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        margin: '0px 8px 8px 0px',
                                    }}
                                >
                                    <FormLabel fontWeight="bold" style={{ margin: '0' }}>
                                        Architecture Name
                                    </FormLabel>
                                </div>
                                <Input
                                    mb={1}
                                    variant="outline"
                                    id="projectName"
                                    borderColor={!projectData.projectName || projectNameCheck ? 'red' : '#CFCFCF'}
                                    maxLength="32"
                                    value={projectData.projectName}
                                    onChange={e => handleProjectData('projectName', e.target.value)}
                                ></Input>
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
                                        You can drag these nodes to the pane on the right.
                                    </h2>
                                </div>

                                <div className={`dndnode output`} onDragStart={event => onDragStart(event, 'default', 'UI')} draggable>
                                    UI
                                </div>

                                <div className={`dndnode output`} onDragStart={event => onDragStart(event, 'default', 'Gateway')} draggable>
                                    Gateway
                                </div>

                                <div className="dndnode output" onDragStart={event => onDragStart(event, 'default', 'Service')} draggable>
                                    Service
                                </div>
                                <div className="dndnode output" onDragStart={event => onDragStart(event, 'default', 'Group')} draggable>
                                    Group
                                </div>
                                <h1
                                    style={{
                                        cursor: 'pointer',
                                        fontSize: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                    onClick={() => toggleOption('Authentication')}
                                >
                                    Authentication {selectedOption === 'Authentication' ? <span>&#x25B2;</span> : <span>&#x25BC;</span>}
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
                                <h1
                                    style={{
                                        cursor: 'pointer',
                                        fontSize: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                    onClick={() => toggleOption('Database')}
                                >
                                    Database {selectedOption === 'Databases' ? <span>&#x25B2;</span> : <span>&#x25BC;</span>}
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

                                <h1>
                                    <span
                                        style={{
                                            cursor: 'pointer',
                                            fontSize: '20px',
                                            justifyContent: 'space-between',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                        onClick={() => toggleOption('serviceDiscovery')}
                                    >
                                        Service Discovery{' '}
                                        {selectedOption === 'serviceDiscovery' ? <span>&#x25B2;</span> : <span>&#x25BC;</span>}
                                    </span>
                                </h1>
                                {selectedOption === 'serviceDiscovery' && (
                                    <>
                                        <div
                                            className="selectorNode1"
                                            onDragStart={event => onDragStart(event, 'default', 'Discovery_eureka')}
                                            draggable
                                        >
                                            <img width="100px" height="40px" src={eurkea} alt="eurekalogo"></img>
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
                                            justifyContent: 'space-between',
                                        }}
                                        onClick={() => toggleOption('loadManagement')}
                                    >
                                        Log Management {selectedOption === 'loadManagement' ? <span>&#x25B2;</span> : <span>&#x25BC;</span>}
                                    </span>
                                </h1>
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
                            </div>
                            <div
                                style={{
                                    position: 'sticky',
                                    bottom: '0',
                                    marginTop: '35px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {initialized && keycloak.authenticated && (
                                    <Checkbox size="md" colorScheme="blue" isChecked={saveMetadata} onChange={Togglesave}>
                                        Save Project
                                    </Checkbox>
                                )}
                                {/* <div style={{ display:'flex', justifyContent:'center'}}> */}
                                <Button
                                    onClick={handleButtonClick}
                                    mt={4}
                                    border="2px"
                                    borderColor="#3182CE"
                                    width="100px"
                                    type="submit"
                                    isDisabled={checkEdge() || checkDisabled()}
                                >
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

                                {!checkNodeExists ? (
                                    <p
                                        style={{
                                            fontSize: '10px',
                                            color: 'red',
                                            marginTop: '5px',
                                        }}
                                    >
                                        Please ensure there exists atleast one application
                                    </p>
                                ) : (
                                    <></>
                                )}
                                {!authenticationData ? (
                                    <p
                                        style={{
                                            fontSize: '10px',
                                            color: 'red',
                                            marginTop: '5px',
                                        }}
                                    >
                                        Please select Authentication type
                                    </p>
                                ) : (
                                    <></>
                                )}
                            </div>
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
                                                imageUrl={keycloakIcon}
                                                description="Description of image 1."
                                                name="Full Stack Architecture"
                                            />
                                        </Box>
                                    );
                                })}
                            </VStack>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
        </>
    );
};

export default Sidebar;
