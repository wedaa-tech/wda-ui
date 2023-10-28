import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Code } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const Documentation = ({ nodeData, nodeId }) => {
    const [seperatedServicesByLabel, setSeperatedServicesByLabel] = useState({});
    const [nodesMapping, setNodesMapping] = useState({});
    const [nodesList, setNodesList] = useState([]);
    const { services } = nodeData || {};

    function separateObjectsByLabel(data) {
        const separatedData = {};
        const nodeMap = {};

        Object.keys(data).forEach((key, idx) => {
            const item = structuredClone(data[key]);
            const label = item.label;
            nodeMap[item.Id] = idx;
            delete item.Id;

            if (!separatedData[label]) {
                separatedData[label] = [];
            }

            separatedData[label].push(item);
        });
        setNodesMapping(() => ({ ...nodeMap }));
        setSeperatedServicesByLabel(structuredClone(separatedData));
    }

    useEffect(() => {
        separateObjectsByLabel(services);
    }, [services]);

    useEffect(() => {
        setNodesList([nodesMapping[nodeId]]);
    }, [nodeId, nodesMapping]);

    if (nodeData == null) {
        return <div>Please select an Component.</div>;
    } else {
        return (
            <>
                <Accordion onChange={idx => setNodesList(() => [...idx])} defaultIndex={[0]} index={nodesList} allowMultiple>
                    {Object.keys(nodeData.services).map(key => (
                        <AccordionItem>
                            <AccordionButton>
                                <Box as="span" flex="1" textAlign="left">
                                    {nodeData.services[key].applicationName}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <Code
                                    style={{
                                        whiteSpace: 'pre',
                                        width: '100%',
                                    }}
                                >
                                    {JSON.stringify(nodeData.services[key], null, 4)}
                                </Code>
                            </AccordionPanel>
                        </AccordionItem>
                    ))}
                </Accordion>
            </>
        );
    }
};

export default Documentation;
