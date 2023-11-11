import React, { useEffect, useState } from 'react';
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, Button, Flex } from '@chakra-ui/react';
import Documentation from './Documentation';
import FolderTree from './FolderTree';
import Readme from './Readme';
import Deployement from './Deployement';
import { useReactFlow } from 'reactflow';
import Infrastructure from './Infrastructure';
import { useKeycloak } from '@react-keycloak/web';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function CodeReview({ nodeId, generateMode = false, deployementData = null, onSubmit = null, onClick = null, published, parentId }) {
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
            Object.keys(deployementData.services).length === 1 &&
            Object.values(deployementData.services)[0]?.applicationFramework === 'docusaurus'
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
    }, [node, getNode, nodeId, deployementData]);

    const publishArchitecture = () => {
        if (initialized) {
            fetch(process.env.REACT_APP_API_BASE_URL + '/api/publish/' + deployementData._id, {
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
        history.push(`/architectures`);
    };

    const handleTabsChange = index => {
        setTabIndex(index);
    };

    return (
        <Flex direction={'column'} height={'inherit'} px={10} py={4} overflowY={'auto'}>
            <Tabs display={'flex'} flexDir={'column'} index={tabIndex} flexGrow={1} onChange={handleTabsChange}>
                <TabList position={'sticky'}>
                    <Tab>Configuration</Tab>
                    <Tab hidden={generateMode}>Folder Structure</Tab>
                    <Tab hidden={generateMode}>README.md</Tab>
                    {!docusaurusCheck && parentId !== 'Admin' && <Tab>{generateMode ? 'Infrastructure' : 'Deployement'}</Tab>}
                </TabList>
                <TabPanels height={'100%'}>
                    <TabPanel height={'100%'}>
                        <Documentation nodeData={deployementData} nodeId={nodeId} generateMode />
                    </TabPanel>
                    <TabPanel height={'inherit'}>
                        <FolderTree nodeType={nodeType} />
                    </TabPanel>
                    <TabPanel height={'100%'}>
                        <Readme nodeType={nodeType} />
                    </TabPanel>
                    {!docusaurusCheck && (
                        <TabPanel hidden={docusaurusCheck} padding={0} height={'100%'}>
                            {!generateMode ? (
                                <Deployement deployementData={deployementData} />
                            ) : (
                                <Infrastructure projectData={deployementData} onSubmit={onSubmit} generateZip={onClick} />
                            )}
                        </TabPanel>
                    )}
                </TabPanels>
            </Tabs>
            <Button
                hidden={!generateMode}
                mx={4}
                my={2}
                colorScheme="blue"
                onClick={tabIndex === 3 || docusaurusCheck ? () => onClick() : () => setTabIndex(3)}
            >
                {docusaurusCheck ? 'Generate' : tabIndex === 3 ? 'Skip Infrastructure' : 'Next'}
            </Button>
            <Button
                hidden={generateMode || parentId !== 'Admin'}
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
