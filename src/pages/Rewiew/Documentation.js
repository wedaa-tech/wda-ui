import React, { useEffect, useState } from 'react';
import AccordionComponent from './AccordianComponent';

const Documentation = ({ nodeData, nodeId, edgeId,dbmlMode }) => {
    const [seperatedServicesByLabel, setSeperatedServicesByLabel] = useState({});
    const [nodesMapping, setNodesMapping] = useState({});
    const [nodesList, setNodesList] = useState([]);
    const { services } = nodeData || {};
    function separateObjectsByLabel(data) {
        const separatedData = {};
        const nodeMap = {};
        if(dbmlMode)
        var serviceIndex=0
        Object.keys(data).forEach((key, idx) => {
            var item = structuredClone(data[key]);
            const label = item.label;
            if(!dbmlMode || (item.Id.startsWith('Service') && item.applicationFramework=="spring" && item.prodDatabaseType=="postgresql")){
            nodeMap[item.Id] =(dbmlMode)? serviceIndex++ :idx;
            delete item.Id;
            if (!separatedData[label]) {
                separatedData[label] = [];
            }
            item={"DbmlData":item?.dbmlData}
            separatedData[label].push(item);
        }
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

        if(dbmlMode)
        {
            if(service.applicationFramework=="spring" && service.prodDatabaseType=="postgresql"){
                return service.dbmlData
            }
            return
        }
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
        const accordionData = [];
        Object.keys(nodeData.services).forEach(key => {
            const id= nodeData.services[key].Id
            var applicationFramework=nodeData.services[key].applicationFramework
            if(!dbmlMode || (id.startsWith('Service') && applicationFramework=='spring')){
                const serviceData = extractServiceData(nodeData.services[key]);
                var label = (dbmlMode) ?`${nodeData.services[key].applicationName}`:`${nodeData.services[key].applicationName} (component)`
                accordionData.push({ label: label, value: serviceData });
            }
        });

        if (!dbmlMode && nodeData?.communications) {
            Object.keys(nodeData.communications).forEach(key => {
                const communicationData = extractCommunicationData(nodeData.communications[key]);
                const communicationType = nodeData.communications[key].type;
                const label =
                    communicationType === 'synchronous'
                        ? `${nodeData.communications[key].client}-${nodeData.communications[key].server} (communication protocol)`
                        : `${nodeData.communications[key].server}-${nodeData.communications[key].client} (communication protocol)`;

                accordionData.push({ label: label, value: communicationData });
            });
        }
        return <AccordionComponent data={accordionData} nodesList={nodesList} setNodesList={setNodesList} dbmlMode={dbmlMode} />;
    }
};

export default Documentation;
