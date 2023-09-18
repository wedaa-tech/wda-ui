import React, { useEffect, useState } from 'react';
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import Documentation from './Documentation';
import FolderTree from './FolderTree';
import Readme from './Readme';
import Deployement from './Deployement';
import { useReactFlow } from 'reactflow';

function CodeReview({ nodeId, generateMode = false, deployementData = null }) {
    const { getNode } = useReactFlow();

    const [nodeData, setNodeData] = useState(null);
    const [nodeType, setNodeType] = useState(null);

    const [node, setNode] = useState(null);

    useEffect(() => {
        console.log(node, nodeId);
        const loadData = () => {
            if (nodeId && getNode(nodeId)) {
                const nd = getNode(nodeId);
                setNode(nd);
                setNodeData(nd.data);
                setNodeType(nd.id);
            }
        };
        loadData();
    }, [node, getNode, nodeId]);

    return (
        <Box flex="1" bg="white" px={10} py={4} overflowY={'auto'}>
            <Tabs height={'95%'} display="flex" flexDirection="column">
                <TabList position={'sticky'}>
                    <Tab>Configuration</Tab>
                    <Tab hidden={generateMode}>Folder Structure</Tab>
                    <Tab hidden={generateMode}>README.md</Tab>
                    <Tab>Deployement</Tab>
                </TabList>
                <TabPanels height={'100%'}>
                    <TabPanel height={'100%'}>
                        <Documentation nodeData={nodeData} generateMode />
                    </TabPanel>
                    <TabPanel height={'inherit'}>
                        <FolderTree nodeType={nodeType} />
                    </TabPanel>
                    <TabPanel height={'100%'}>
                        <Readme nodeType={nodeType} />
                    </TabPanel>
                    <TabPanel height={'inherit'}>
                        <Deployement deployementData={deployementData} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
}

export default CodeReview;
