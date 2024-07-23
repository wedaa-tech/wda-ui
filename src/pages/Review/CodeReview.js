import React, { useEffect, useState, useRef } from 'react';
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, Button, Flex, useToast, Spinner } from '@chakra-ui/react';
import Documentation from './Documentation';
import FolderTree from './FolderTree';
import Readme from './Readme';
import Deployment from './Deployment';
import { useReactFlow } from 'reactflow';
import Infrastructure from './Infrastructure';
import { useKeycloak } from '@react-keycloak/web';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { saveAs } from 'file-saver';
import CreditView from './CreditView';
import Functions from '../Designer/utils';
import RefArchModal from './RefArchModal'; 

function CodeReview({
    nodeId,
    edgeId,
    generateMode = false,
    deploymentData = null,
    onSubmit = null,
    onClick = null,
    published,
    parentId,
    setIsGenerating = null,
}) {
    const { getNode,getNodes,getEdges } = useReactFlow();
    const { initialized, keycloak } = useKeycloak();
    const [nodeData, setNodeData] = useState(null);
    const [nodeType, setNodeType] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [docusaurusCheck, setDocusaurusCheck] = useState(false);
    const [serviceSpringCheck,setServiceSpringCheck]=useState(false);
    const [isArchPublished, setArchPublished] = useState(published);
    const [node, setNode] = useState(null);
    const history = useHistory();
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [refArchData,setRefArchData] = useState({});

    useEffect(() => {
        if (
            Object.keys(deploymentData.services).length === 1 &&
            Object.values(deploymentData.services)[0]?.applicationFramework === 'docusaurus'
        ) 
        {
            setDocusaurusCheck(true);
        }

        for (const serviceId in deploymentData.services) {
            if (deploymentData.services[serviceId].Id.startsWith("Service")) {
                const service = deploymentData.services[serviceId];
                if (service.applicationFramework === "spring" && service.prodDatabaseType === "postgresql" && service?.dbmlData) {
                    setServiceSpringCheck(true);
                    break;
                }
            }
        }

        const loadData = () => {
            if (nodeId && getNode(nodeId)) {
                const nd = getNode(nodeId);
                setNode(nd);
                setNodeData(nd.data);
                setNodeType(nd.id);
            }
        };
        loadData();
    }, [node, getNode, nodeId, deploymentData]);

    const toast = useToast({
        containerStyle: {
            width: '500px',
            maxWidth: '100%',
        },
    });

    const toastIdRef = useRef();

    const publishArchitecture = () => {
        if (initialized) {
            fetch(process.env.REACT_APP_API_BASE_URL + '/api/publish/' + deploymentData.projectId, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
            })
                .then(response => response.json())
                .then(res => {
                    setArchPublished(!isArchPublished);
                })
                .catch(error => console.error('Error updating Architecture:', error));
        }
        var name = deploymentData.projectName;
        var msg = `Architecture ${name[0].toUpperCase() + name.slice(1)} is ${isArchPublished ? 'Revoked' : 'Published'}`;
        toast.close(toastIdRef.current);
        toast({
            title: msg,
            status: isArchPublished ? 'error' : 'success',
            duration: 3000,
            variant: 'left-accent',
            isClosable: true,
        });
    };
    
    const handleRefArch = async (Data) => {
        setRefArchData(Data);    
        setIsModalOpen(true);

    };

    const handlesubmit = async (Data, submit) => {
        if (onSubmit) onSubmit(Data, submit);
        else {
            const Data = deploymentData;
            setIsGenerating(true);
            var blueprintId;
            try {
                const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/generate', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                    },
                    body: JSON.stringify(Data),
                });
                blueprintId = response.headers.get('blueprintid');
                await new Promise(resolve => setTimeout(resolve, 10000));
                setIsGenerating(false);
            } catch (error) {
                console.error(error);
            } finally {
                if (initialized && keycloak.authenticated) {
                    if (parentId === 'admin') {
                        history.replace('/architectures');
                    } else {
                        history.replace('/prototypes');
                    }
                } else {
                    history.push('/canvasToCode');
                }
            }
        }
    };

    const handleTabsChange = index => {
        setTabIndex(index);
    };

    const handlePublish = async (projectName) => {
        var blueprintId;
        var Data = { ...refArchData };
        var nodes = getNodes();
        var edges = getEdges();
        const generatedImage = await Functions.CreateImage(Object.values(nodes));
        if (generatedImage) Data.imageUrl = generatedImage;

        const nodesMetadata = nodes.reduce((acc, node) => {
            acc[node.id] = node;
            return acc;
        }, {});
    
        const edgesMetadata = edges.reduce((acc, edge) => {
            acc[edge.id] = edge;
            return acc;
        }, {});
    
        Data.metadata = { nodes: nodesMetadata, edges: edgesMetadata };
        Data.projectName = projectName;
        if (Data?.projectId) delete Data.projectId;
    
        var response;
        try {
            response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/refArchs', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
                body: JSON.stringify(Data),
            });
            blueprintId = response.headers.get('blueprintid');
        } catch (error) {
            console.error(error);
        } finally {
            toast.close(toastIdRef.current);
            if (response) {
                var res = await response.json();
            }
            toast({
                title: response?.ok ? 'Architecture published as Ref Architecture' : res.message,
                status: response?.ok ? 'success' : 'error',
                duration: 3000,
                variant: 'left-accent',
                isClosable: true,
            });
        }
    };
    

    return (
        <Flex direction={'column'} height={'inherit'} px={10} py={4} overflowY={'auto'}>
            <Tabs display={'flex'} flexDir={'column'} index={tabIndex} flexGrow={1} onChange={handleTabsChange}>
                <TabList position={'sticky'}>
                    <Tab>Configuration</Tab>
                    {!docusaurusCheck && serviceSpringCheck && <Tab> Credits </Tab>}
                    {/* <Tab hidden={generateMode}>Folder Structure</Tab> */}
                    {!docusaurusCheck && <Tab> IaaC </Tab>}
                    <Tab>Components</Tab>
                    {/* dbml */}
                    {!docusaurusCheck && serviceSpringCheck && <Tab> Dbml Scripts </Tab>}

                </TabList>
                <TabPanels height={'100%'}>
                    <TabPanel height={'100%'}>
                        <Documentation nodeData={deploymentData} nodeId={nodeId} edgeId={edgeId} generateMode />
                    </TabPanel>
                    
                    {serviceSpringCheck &&
                    <TabPanel height={'100%'}>
                        <CreditView deploymentData={deploymentData} />
                    </TabPanel>
                    }
                    {/* <TabPanel height={'inherit'}>
                        <FolderTree nodeType={nodeType} />
                    </TabPanel> */}
                    {!docusaurusCheck && (
                        <TabPanel p={0} hidden={docusaurusCheck} height={'100%'}>
                            {!generateMode ? (
                                <Deployment deploymentData={deploymentData} onSubmit={handlesubmit} generateZip={onClick} parentId={parentId} handleRefArch={handleRefArch} adminView={keycloak?.realmAccess?.roles.includes('ADMIN')}/>
                            ) : (
                                <Infrastructure projectData={deploymentData} onSubmit={handlesubmit} generateZip={onClick} handleRefArch={handleRefArch} adminView={keycloak?.realmAccess?.roles.includes('ADMIN')}/>
                            )}
                        </TabPanel>
                    )}
                    <TabPanel height={'100%'}>
                        <Readme nodeType={nodeType} nodeData={nodeData} />
                    </TabPanel>
                    {/* dbml */}
                    <TabPanel height={'100%'}>
                    <Documentation nodeData={deploymentData} nodeId={nodeId} edgeId={edgeId} generateMode dbmlMode />
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Button
                hidden={ tabIndex==1 && !serviceSpringCheck || tabIndex == 2 ||tabIndex== 3 || tabIndex== 4 ||parentId=='admin' }
                mx={4}
                my={2}
                colorScheme="blue"
                onClick={tabIndex === 2 || docusaurusCheck ? () => onClick() : () => setTabIndex(tabIndex+1)}
            >
                {docusaurusCheck ? 'Generate' : 'Next'}
            </Button>
            <Button
                hidden={generateMode || parentId !== 'admin' || tabIndex == 2 || tabIndex == 1}
                mx={4}
                my={2}
                colorScheme={isArchPublished ? 'red' : 'green'}
                onClick={publishArchitecture}
            >
                {isArchPublished ? 'Revoke' : 'Publish'}
            </Button>
            <RefArchModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handlePublish} 
            />
        </Flex>
    );
}

export default CodeReview;
