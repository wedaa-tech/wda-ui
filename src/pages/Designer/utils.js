import { useCallback } from 'react';
const MarkerType = { ArrowClosed: 'arrowclosed' };

const onclick = (e, node, setNodeType, setCurrentNode, setopen, setNodeClick, nodes) => {
    var Id = e.target.dataset.id || e.target.name || node.id;
    if (Id === 'spring' || Id === 'gomicro' || Id === 'react' || Id === 'angular' || Id === 'docusaurus' || Id === 'gateway') Id = node.id;
    if (Id) {
        if (Id === 'oauth2') Id = 'authenticationType';
        if (Id === 'eck') Id = 'logManagement';
        if (Id === 'eureka') Id = 'serviceDiscoveryType';
        const type = Id.split('_')[0];
        setNodeType(type);
        if (type === 'aws' || type === 'azure') {
            setCurrentNode(nodes['cloudProvider'].data);
        } else {
            const nodeData = nodes[Id].data;
            nodeData.Id = Id;
            setCurrentNode({ ...nodeData });
        }
        setopen(Id);
    }
    setNodeClick(Id);
};
const addEdge = (edgeParams, edges, updated) => {
    updated = true;
    const edgeId = `${edgeParams.source}-${edgeParams.target}`;
    const databaseEdge = edgeParams?.target.startsWith('Database');
    const groupEdge = edgeParams?.target.startsWith('group') || edgeParams?.source.startsWith('group');
    if (!edges[edgeId] && !databaseEdge && !groupEdge) {
        edges[edgeId] = {
            id: edgeId,
            ...edgeParams,
            className: 'warning',
            markerEnd: {
                color: '#ff0000',
                type: MarkerType.ArrowClosed,
            },
        };
    }
    if (databaseEdge || groupEdge) {
        edges[edgeId] = {
            id: edgeId,
            ...edgeParams,
            className: 'success',
            markerEnd: {
                color: 'black',
                type: MarkerType.ArrowClosed,
            },
        };
    }
    return { ...edges };
};
const MergeData = (sourceId, targetId, Nodes, setNodes) => {
    const sourceType = sourceId.split('_')[0];
    const targetType = targetId.split('_')[0];
    if (sourceType !== targetType) {
        if ((sourceType === 'Service' && targetType === 'Database') || (sourceType === 'UI' && targetType === 'Database')) {
            let AllNodes = { ...Nodes };
            let sourceNode = AllNodes[sourceId];
            let targetNode = AllNodes[targetId];
            AllNodes[sourceId].data = {
                ...sourceNode.data,
                prodDatabaseType: targetNode.data.prodDatabaseType,
                databasePort: targetNode.data.databasePort,
            };
            setNodes({ ...AllNodes });
        }
    }
};

const Functions = {
    onclick: onclick,
    addEdge: addEdge,
    MergeData: MergeData,
};

export default Functions;
