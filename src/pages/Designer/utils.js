import { useCallback } from 'react';
import { getRectOfNodes, getTransformForBounds } from 'reactflow';
import { toPng } from 'html-to-image';

const imageWidth = 1024;
const imageHeight = 768;
const MarkerType = { ArrowClosed: 'arrowclosed' };

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
const onCheckEdge = edges => {
    let NewEdges = { ...edges };
    for (const key in NewEdges) {
        const Edge = NewEdges[key];
        if (Edge.id.startsWith('UI')) {
            if (Edge.data.type === 'synchronous' && Edge.data.framework === 'rest-api') {
                delete Edge.data.type;
                delete Edge.data.framework;
            }
        }
    }
};
const useOnEdgeUpdateEnd = () => {
    return useCallback((Nodes, edge, edgeUpdateSuccessful, setEdges, setNodes) => {
        if (!edgeUpdateSuccessful.current) {
            setEdges(edges => {
                let AllEdges = { ...edges };
                if (edge.target.startsWith('Database')) {
                    // If the edge is removed between Service and Database
                    let UpdatedNodes = { ...Nodes };
                    delete UpdatedNodes[edge.source].data.prodDatabaseType;
                    UpdatedNodes[edge.target].data.isConnected = false;
                    if (UpdatedNodes[edge.target]) {
                        UpdatedNodes[edge.target].style.border = '1px solid red';
                    }
                    setNodes(UpdatedNodes);
                }
                if (edge.target.startsWith('log') || edge.target.startsWith('serviceDiscovery') || edge.target.startsWith('auth')) {
                    var edgeValid = true;
                    for (const key in edges) {
                        const edgeExists = edges[key];
                        if (edgeExists.target === edge.target && edge.source !== edgeExists.source) {
                            edgeValid = false;
                            break;
                        }
                    }
                    if (edgeValid) {
                        setNodes(nodes => {
                            var updatedNodes = { ...nodes };
                            updatedNodes[edge.target].style.border = '1px solid red';
                            return updatedNodes;
                        });
                    }
                }
                // else if (edge.target.startsWith('authenticationType')) {
                //     let UpdatedNodes = { ...Nodes };
                // } else if (edge.target.startsWith('serviceDiscoveryType')) {
                //     let UpdatedNodes = { ...Nodes };
                // } else if (edge.target.startsWith('logManagement')) {
                //     let UpdatedNodes = { ...Nodes };
                // }
                delete AllEdges[edge.id];
                return AllEdges;
            });
        }
        edgeUpdateSuccessful.current = true;
    }, []);
};
const useOnEdgeUpdateStart = edgeUpdateSuccessful => {
    return useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);
};

const CreateImage = async nodes => {
    const nodesBounds = getRectOfNodes(nodes);
    const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0, 2, 0.9);
    try {
        const response = await toPng(document.querySelector('.react-flow__viewport'), {
            backgroundColor: '#ffffff',
            width: imageWidth,
            height: imageHeight,
            style: {
                transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
            },
        });

        return response;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const Functions = {
    addEdge: addEdge,
    MergeData: MergeData,
    onCheckEdge: onCheckEdge,
    onEdgeUpdateEnd: useOnEdgeUpdateEnd,
    onEdgeUpdateStart: useOnEdgeUpdateStart,
    CreateImage: CreateImage,
};

export default Functions;
