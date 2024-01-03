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

function CodeReview({
    nodeId,
    generateMode = false,
    deploymentData = null,
    onSubmit = null,
    onClick = null,
    published,
    parentId,
    setIsGenerating = null,
}) {
    const { getNode } = useReactFlow();
    const { initialized, keycloak } = useKeycloak();
    const [nodeData, setNodeData] = useState(null);
    const [nodeType, setNodeType] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [docusaurusCheck, setDocusaurusCheck] = useState(false);
    const [isArchPublished, setArchPublished] = useState(published);
    const [node, setNode] = useState(null);
    const history = useHistory();

    useEffect(() => {
        if (
            Object.keys(deploymentData.services).length === 1 &&
            Object.values(deploymentData.services)[0]?.applicationFramework === 'docusaurus'
        ) {
            setDocusaurusCheck(true);
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

    const handlesubmit = async (Data, submit) => {
        if (onSubmit) onSubmit(Data, submit);
        else {
            const Data = deploymentData;
            setIsGenerating(true);
            var blueprintId;
            try {
                const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/generate', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                    },
                    body: JSON.stringify(Data),
                });
                blueprintId = response.headers.get('blueprintid');
                const blob = await response.blob();
                setIsGenerating(false);
                saveAs(blob, `${Data.projectName}.zip`);
            } catch (error) {
                console.error(error);
            } finally {
                if (initialized && keycloak.authenticated) {
                    if (parentId === 'admin') {
                        history.replace('/project/admin/architecture/' + Data.projectId + '/details');
                    } else {
                        history.replace('/project/' + Data.parentId + '/architecture/' + Data.projectId + '/details');
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

    return (
        <Flex direction={'column'} height={'inherit'} px={10} py={4} overflowY={'auto'}>
            <Tabs display={'flex'} flexDir={'column'} index={tabIndex} flexGrow={1} onChange={handleTabsChange}>
                <TabList position={'sticky'}>
                    <Tab>Configuration</Tab>
                    {/* <Tab hidden={generateMode}>Folder Structure</Tab> */}
                    {!docusaurusCheck && <Tab> IaaC </Tab>}
                    <Tab>Components</Tab>
                </TabList>
                <TabPanels height={'100%'}>
                    <TabPanel height={'100%'}>
                        <Documentation nodeData={deploymentData} nodeId={nodeId} generateMode />
                    </TabPanel>
                    {/* <TabPanel height={'inherit'}>
                        <FolderTree nodeType={nodeType} />
                    </TabPanel> */}
                    {!docusaurusCheck && (
                        <TabPanel p={0} hidden={docusaurusCheck} height={'100%'}>
                            {!generateMode ? (
                                <Deployment deploymentData={deploymentData} />
                            ) : (
                                <Infrastructure projectData={deploymentData} onSubmit={handlesubmit} generateZip={onClick} />
                            )}
                        </TabPanel>
                    )}
                    <TabPanel height={'100%'}>
                        <Readme nodeType={nodeType} nodeData={nodeData} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Button
                hidden={!generateMode || tabIndex === 1 || tabIndex == 2}
                mx={4}
                my={2}
                colorScheme="blue"
                onClick={tabIndex === 2 || docusaurusCheck ? () => onClick() : () => setTabIndex(1)}
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
        </Flex>
    );
}

export default CodeReview;
