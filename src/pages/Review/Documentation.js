import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Code } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const Documentation = ({ nodeData, nodeId, edgeId }) => {
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
        if (nodeData.communications) {
            Object.keys(nodeData.communications).forEach((key, idx) => {
                const item = structuredClone(nodeData.communications[key]);
                let label;
                if (item.type == 'synchronous') {
                    label = `${item.client}-${item.server}`;
                } else {
                    label = `${item.server}-${item.client}`;
                }
                nodeMap[label] = idx + Object.keys(data).length;

                if (!separatedData[label]) {
                    separatedData[label] = [];
                }

                separatedData[label].push(item);
            });
        }
        setNodesMapping(() => ({ ...nodeMap }));
        setSeperatedServicesByLabel(structuredClone(separatedData));
    }

    function extractCommunicationData(communication) {
        const { client, server, type, framework } = communication;
        return framework === 'rabbitmq' ? { producer: server, consumer: client, type, framework } : { client, server, type, framework };
    }

    function extractServiceData(service) {
        const {
            applicationFramework,
            applicationName,
            packageName,
            serverPort,
            applicationType,
            authenticationType,
            logManagementType,
            serviceDiscoveryType,
        } = service;

        const extractedData = {
            applicationFramework,
            applicationName,
            packageName,
            serverPort,
            applicationType,
        };

        if (authenticationType) {
            extractedData.authenticationType = authenticationType;
        }
        if (logManagementType) {
            extractedData.logManagementType = logManagementType;
        }
        if (serviceDiscoveryType) {
            extractedData.serviceDiscoveryType = serviceDiscoveryType;
        }

        return extractedData;
    }

    useEffect(() => {
        separateObjectsByLabel(services);
    }, [services]);

    useEffect(() => {
        if (nodeId) {
            setNodesList([nodesMapping[nodeId]]);
        } else if (edgeId) {
            setNodesList([nodesMapping[edgeId]]);
        }
    }, [nodeId, nodesMapping, edgeId]);
    if (nodeData == null) {
        return <div>Please select an Component.</div>;
    } else {
        return (
            <>
                <Accordion onChange={idx => setNodesList(() => [...idx])} defaultIndex={[0]} index={nodesList} allowMultiple>
                    {Object.keys(nodeData.services).map(key => {
                        const serviceData = extractServiceData(nodeData.services[key]);
                        return (
                            <AccordionItem key={key}>
                                <AccordionButton>
                                    <Box as="span" flex="1" textAlign="left">
                                        {`${nodeData.services[key].applicationName} (component)`}
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
                                        {JSON.stringify(serviceData, null, 4)}
                                    </Code>
                                </AccordionPanel>
                            </AccordionItem>
                        );
                    })}

                    {nodeData?.communications &&
                        Object.keys(nodeData.communications).map(key => {
                            const communicationData = extractCommunicationData(nodeData.communications[key]);
                            const communicationType = nodeData.communications[key].type;
                            return (
                                <AccordionItem key={key}>
                                    <AccordionButton>
                                        <Box as="span" flex="1" textAlign="left">
                                            {communicationType == 'synchronous'
                                                ? `${nodeData.communications[key].client}-${nodeData.communications[key].server} (communication protocol)`
                                                : `${nodeData.communications[key].server}-${nodeData.communications[key].client} (communication protocol)`}
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
                                            {JSON.stringify(communicationData, null, 4)}
                                        </Code>
                                    </AccordionPanel>
                                </AccordionItem>
                            );
                        })}
                </Accordion>
            </>
        );
    }
};

export default Documentation;
