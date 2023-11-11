import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    Controls,
    MarkerType,
    MiniMap,
    ConnectionLineType,
    Background,
    BackgroundVariant,
    Panel,
    getRectOfNodes,
    getTransformForBounds,
    useReactFlow,
} from 'reactflow';
import { AiOutlineClear } from 'react-icons/ai';
import 'reactflow/dist/style.css';
import { Box, Button, Flex, HStack, Icon, IconButton, Spinner, Text, VStack, useToast } from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';
import Sidebar from './../components/Sidebar';
import { saveAs } from 'file-saver';
import ServiceModal from '../components/Modal/ServiceModal';
import UiDataModal from '../components/Modal/UIModal';
import GatewayModal from '../components/Modal/GatewayModal';
import GroupDataModal from '../components/Modal/GroupDataModel';
import CustomImageNode from './Customnodes/CustomImageNode';
import CustomServiceNode from './Customnodes/CustomServiceNode';
import CustomIngressNode from './Customnodes/CustomIngressNode';
import CustomAuthNode from './Customnodes/CustomAuthNode';
import CustomMessageBrokerNode from './Customnodes/CustomMessageBrokerNode';
import CustomCloudNode from './Customnodes/CustomCloudNode';
import CustomLoadNode from './Customnodes/CustomLoadNode';
import CustomLocalenvironmentNode from './Customnodes/CustomLocalenvironmentNode';
import AlertModal from '../components/Modal/AlertModal';
import resizeableNode from './Customnodes/ResizeableNode';
import groupNode from './Customnodes/GroupNode';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import './../App.css';
import EdgeModal from '../components/Modal/EdgeModal';
import { useKeycloak } from '@react-keycloak/web';
import { FiUploadCloud } from 'react-icons/fi';
import ActionModal from '../components/Modal/ActionModal';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Review, { ReviewFlow } from './Rewiew';
import { toPng } from 'html-to-image';
import DownloadButton from '../components/DownloadButton';
import ContextMenu from '../components/ContextMenu';
import CustomNodeModal from '../components/Modal/CustomNodeModal';

let serviceId = 1;
let gatewayId = 1;
let databaseId = 1;
let groupId = 1;
let uiId = 1;
let uiCount = 0;

const getId = (type = '') => {
    if (type === 'Service') return `Service_${serviceId++}`;
    else if (type === 'Database') return `Database_${databaseId++}`;
    else if (type === 'Authentication') return 'Authentication_1';
    else if (type === 'UI') return `UI_${uiId++}`;
    else if (type === 'Gateway') return `Gateway_${gatewayId++}`;
    else if (type === 'Group') return `group_${groupId++}`;
    return 'Id';
};

const defaultViewport = { x: 0, y: 0, zoom: 10 };

const nodeTypes = {
    selectorNode: CustomImageNode,
    selectorNode1: CustomServiceNode,
    selectorNode2: CustomIngressNode,
    selectorNode3: CustomAuthNode,
    selectorNode4: CustomMessageBrokerNode,
    selectorNode5: CustomCloudNode,
    selectorNode6: CustomLoadNode,
    selectorNode7: CustomLocalenvironmentNode,
    ResizableNode: resizeableNode,
    GroupNode: groupNode,
};

const imageWidth = 1024;
const imageHeight = 768;

const Designer = ({ update, viewMode = false, sharedMetadata = undefined }) => {
    const [viewOnly, setViewOnly] = useState(viewMode);
    const reactFlowWrapper = useRef(null);
    const { keycloak, initialized } = useKeycloak();
    const [nodes, setNodes] = useState(sharedMetadata?.nodes || {});
    const [edges, setEdges] = useState(sharedMetadata?.edges || {});
    const [showDiv, setShowDiv] = useState(false);
    const [nodeType, setNodeType] = useState(null);
    const [ServiceDiscoveryCount, setServiceDiscoveryCount] = useState(0);
    const [MessageBrokerCount, setMessageBrokerCount] = useState(0);
    const [UICount, setUiCount] = useState(0);
    const [docsCount, setDocsCount] = useState(0);
    const [CloudProviderCount, setCloudProviderCount] = useState(0);
    const [LocalenvironmentCount, setLocalenvironmentCount] = useState(0);
    const [LogManagemntCount, setLogManagementCount] = useState(0);
    const [AuthProviderCount, setAuthProviderCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmptyUiSubmit, setIsEmptyUiSubmit] = useState(false);
    const [isEmptyServiceSubmit, setIsEmptyServiceSubmit] = useState(false);
    const location = useLocation();
    const [userData, setuserData] = useState({});
    const [isEmptyGatewaySubmit, setIsEmptyGatewaySubmit] = useState(false);
    const [isUINodeEnabled, setIsUINodeEnabled] = useState(false);
    const [isGatewayNodeEnabled, setIsGatewayNodeEnabled] = useState(false);
    const [applicationData, setApplicationData] = useState({
        docusaurus: false,
        ui: false,
    });
    const [serviceInputCheck, setServiceInputCheck] = useState({});
    const [uiInputCheck, setUiInputCheck] = useState({});
    const [gatewayInputCheck, setGatewayInputCheck] = useState({});

    const [updated, setUpdated] = useState(false);
    const [isVisibleDialog, setVisibleDialog] = useState(false);
    const [actionModalType, setActionModalType] = useState('clear');
    const history = useHistory();
    const [triggerExit, setTriggerExit] = useState({
        onOk: false,
        path: '',
    });

    const CreateImage = async nodes => {
        const nodesBounds = getRectOfNodes(nodes);
        const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);

        try {
            const response = await toPng(document.querySelector('.react-flow__viewport'), {
                backgroundColor: '#ffffff',
                width: imageWidth,
                height: imageHeight,
                style: {
                    width: imageWidth,
                    height: imageHeight,
                    transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
                },
            });

            setImage(response);
            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const handleGoToIntendedPage = useCallback(
        location => {
            history.push(`${location}`);
        },
        [history],
    );

    const addEdge = (edgeParams, edges) => {
        setUpdated(true);
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
        // return { ...edges, [edgeId]: { id: edgeId, ...edgeParams } };
    };

    const updateEdge = (oldEdge, newConnection, edges, Nodes) => {
        setUpdated(true);
        let newEdgeId = newConnection.source + '-' + newConnection.target;
        newConnection.markerEnd = { type: MarkerType.ArrowClosed };
        newConnection.type = 'straight';
        newConnection.data = {};
        let updatedEdges = {
            ...edges,
            [newEdgeId]: { id: newEdgeId, ...newConnection },
        };
        if (oldEdge.id !== newEdgeId) delete updatedEdges[oldEdge.id];
        const oldSourceNode = Nodes[oldEdge.source];
        delete oldSourceNode?.data?.prodDatabaseType;
        setNodes(prev => ({ ...prev, [oldSourceNode.id]: oldSourceNode }));
        return updatedEdges;
    };

    const onNodesChange = useCallback((setShowDiv, edges, changes = []) => {
        setUpdated(true);
        setNodes(oldNodes => {
            const updatedNodes = { ...oldNodes };
            const updatedEdges = { ...edges };
            const deletedApplicationNames = []; // Track deleted application names
            const deletedApplicationPorts = [];

            changes.forEach(change => {
                switch (change.type) {
                    case 'dimensions':
                        if (change.resizing) {
                            updatedNodes[change.id] = {
                                ...updatedNodes[change.id],
                                position: {
                                    ...updatedNodes[change.id].position,
                                },
                                style: {
                                    ...updatedNodes[change.id].style,
                                    ...change.dimensions,
                                },
                            };
                            const label = updatedNodes[change.id]?.data?.label;
                            if (label) {
                                const calculatedWidth = label.length * 10 + 30;
                                const actualWidth = updatedNodes[change.id].style.width;
                                if (calculatedWidth >= actualWidth) {
                                    const words = label.split(/\s+/);
                                    const nonEmptyWords = words.filter(word => word.length > 0);
                                    const height = nonEmptyWords.length * 12 + 30;
                                    if (updatedNodes[change.id].style.height < height) {
                                        updatedNodes[change.id].style.height = height;
                                    }
                                }
                            }
                        }

                        break;
                    case 'position':
                        if (change?.position) {
                            updatedNodes[change.id] = {
                                ...updatedNodes[change.id],
                                position: {
                                    ...updatedNodes[change.id]?.position,
                                    ...change.position,
                                },
                                positionAbsolute: {
                                    x: 0,
                                    y: 0,
                                    ...updatedNodes[change.id]?.positionAbsolute,
                                    ...change.positionAbsolute,
                                },
                                dragging: change.dragging,
                            };
                        }
                        break;
                    case 'select':
                        updatedNodes[change.id] = {
                            ...updatedNodes[change.id],
                            selected: change.selected,
                        };
                        break;
                    case 'remove': // Delete Functionality
                        var deletedNodeData = updatedNodes[change.id];
                        if (change.id === 'messageBroker') {
                            setIsMessageBroker(false);
                            onCheckEdge(edges);
                            setMessageBrokerCount(0);
                        } else if (change.id.startsWith('UI')) {
                            setIsEmptyUiSubmit(false);
                            setIsUINodeEnabled(false);
                            uiCount--;
                            if (change?.id && deletedNodeData?.data?.applicationFramework) {
                                setApplicationData(prev => ({
                                    ...prev,
                                    [deletedNodeData.data.applicationFramework]: false,
                                }));
                            }
                            if (deletedNodeData?.data?.applicationFramework === 'docusaurus') {
                                setDocsCount(0);
                            } else if (
                                deletedNodeData?.data?.applicationFramework === 'react' ||
                                deletedNodeData?.data?.applicationFramework === 'angular'
                            ) {
                                setUiCount(0);
                            }
                            setUiInputCheck(prev => {
                                const updatedState = { ...prev };
                                delete updatedState[change.id];
                                return updatedState;
                            });
                        } else if (change.id.startsWith('Service')) {
                            setIsEmptyServiceSubmit(false);
                            setServiceInputCheck(prev => {
                                const updatedState = { ...prev };
                                delete updatedState[change.id];
                                return updatedState;
                            });
                        } else if (change.id.startsWith('Gateway')) {
                            setIsEmptyGatewaySubmit(false);
                            setIsGatewayNodeEnabled(false);
                            setGatewayInputCheck(prev => {
                                const updatedState = { ...prev };
                                delete updatedState[change.id];
                                return updatedState;
                            });
                        } else if (change.id === 'serviceDiscoveryType') {
                            setIsServiceDiscovery(false);
                            setServiceDiscoveryCount(0);
                            setIsServiceDiscovery(false);
                            for (let key in updatedEdges) {
                                let Edge = updatedEdges[key];
                                if (Edge?.data?.framework === 'rest-api') {
                                    delete Edge?.data?.type;
                                    delete Edge?.data?.framework;
                                    delete Edge?.label;
                                }
                                if (key.split('-')[1] == 'serviceDiscoveryType') {
                                    delete updatedEdges[key];
                                }
                                setEdges(updatedEdges);
                            }
                        } else if (change.id === 'cloudProvider') {
                            setCloudProviderCount(0);
                        } else if (change.id === 'authenticationType') {
                            setAuthProviderCount(0);
                        } else if (change.id === 'Localenvironment') {
                            setLocalenvironmentCount(0);
                        } else if (change.id === 'logManagement') {
                            setLogManagementCount(0);
                        }
                        // Remove the deleted node from updatedNodes
                        delete updatedNodes[change.id];
                        // Remove the applicationName from uniqueApplicationNames
                        const deletedNode = oldNodes[change.id];
                        if (deletedNode?.data?.applicationName) {
                            deletedApplicationNames.push(deletedNode.data.applicationName.trim());
                        }
                        if (deletedNode?.data?.serverPort) {
                            deletedApplicationPorts.push(deletedNode.data.serverPort.trim());
                        }
                        break;
                    default:
                        break;
                }
            });
            if (Object.keys(updatedNodes).length === 0) setShowDiv(true);
            // Remove deleted application names from uniqueApplicationNames
            setUniquePortNumbers(prev => prev.filter(portNumbers => !deletedApplicationPorts.includes(portNumbers)));
            setUniqueApplicationNames(prev => prev.filter(appName => !deletedApplicationNames.includes(appName)));
            return updatedNodes;
        });
    }, []);

    const onEdgesChange = useCallback((Nodes, changes = []) => {
        setUpdated(true);
        setEdges(oldEdges => {
            const updatedEdges = { ...oldEdges };
            let UpdatedNodes = { ...Nodes };
            changes.forEach(change => {
                switch (change.type) {
                    case 'add':
                        // Handle add event
                        break;
                    case 'remove':
                        let [sourceId, targetId] = change.id.split('-');
                        if (targetId.startsWith('Database')) {
                            UpdatedNodes[targetId].data.isConnected = false;
                            if (UpdatedNodes[targetId]?.style) {
                                UpdatedNodes[targetId].style.border = '1px solid red';
                            }
                            if (sourceId.startsWith('Service') || sourceId.startsWith('UI'))
                                delete UpdatedNodes[sourceId].data.prodDatabaseType;
                            setNodes(UpdatedNodes);
                        }
                        delete updatedEdges[change.id];
                        // Handle remove event
                        break;
                    case 'update':
                        // Handle update event
                        break;
                    case 'select':
                        updatedEdges[change.id] = {
                            ...updatedEdges[change.id],
                            selected: change.selected,
                        };
                        break;
                    default:
                        break;
                }
            });

            return updatedEdges;
        });
    }, []);

    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [Isopen, setopen] = useState(false);
    const [nodeClick, setNodeClick] = useState(false);
    const [IsEdgeopen, setEdgeopen] = useState(false);
    const [CurrentNode, setCurrentNode] = useState({});
    const [CurrentEdge, setCurrentEdge] = useState({});
    const edgeUpdateSuccessful = useRef(true);
    const [isMessageBroker, setIsMessageBroker] = useState(false);
    const [isServiceDiscovery, setIsServiceDiscovery] = useState(false);
    const [saveMetadata, setsaveMetadata] = useState(true);

    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);

    const onEdgeUpdate = useCallback((Nodes, oldEdge, newConnection) => {
        setUpdated(true);
        edgeUpdateSuccessful.current = true;
        if (!(newConnection.target.startsWith('Database') && Nodes[newConnection.source]?.data['prodDatabaseType'])) {
            // Validation of service Node to check if it has database or not
            setEdges(els => updateEdge(oldEdge, newConnection, els, Nodes));
            MergeData(newConnection.source, newConnection.target, Nodes);
        }
    }, []);

    const onEdgeUpdateEnd = useCallback((Nodes, edge) => {
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
                        if (edgeExists.target === edge.target && edge.source != edgeExists.source) {
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

    const onDragOver = useCallback(event => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        setShowDiv(false);
    }, []);

    const onclick = (e, node) => {
        var Id = e.target.dataset.id || e.target.name || node.id;
        if (Id == 'spring' || Id === 'gomicro' || Id === 'react' || Id === 'angular' || Id === 'docusaurus' || Id === 'gateway')
            Id = node.id;
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
    const clear = () => {
        localStorage.clear();
        setuserData({});
        setNodes({});
        setEdges({});
        setIsServiceDiscovery(false);
        setServiceDiscoveryCount(0);
        setUniqueApplicationNames([]);
        setUniquePortNumbers([]);
        setServiceInputCheck([]);
        setUiInputCheck({});
        setGatewayInputCheck([]);
        databaseId = 1;
        groupId = 1;
        serviceId = 1;
        uiId = 1;
        gatewayId = 1;
        uiCount = 0;
        setAuthProviderCount(0);
        setIsMessageBroker(false);
        setIsUINodeEnabled(false);
        setIsGatewayNodeEnabled(false);
        setMessageBrokerCount(0);
        setLogManagementCount(0);
        setLocalenvironmentCount(0);
        setUiCount(0);
        setDocsCount(0);
        setApplicationData({
            docusaurus: false,
            ui: false,
        });
        setUpdated(false);
        setTriggerExit({
            onOk: false,
            path: '',
        });
    };

    const onDrop = useCallback(
        (event, servicecount, messagecount, loadcount, authcount, Localenvcount, UICount, docsCount) => {
            setUpdated(true);
            event.preventDefault();
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');
            const name = event.dataTransfer.getData('Name');
            if (typeof type === 'undefined' || !type) {
                setShowDiv(true);
                return;
            } else if (type === 'marketNode') {
                const marketMetaData = JSON.parse(event.dataTransfer.getData('metaData'));
                setNodes(nds => ({ ...nds, ...marketMetaData.nodes }));
                setEdges(eds => ({ ...eds, ...marketMetaData.edges }));
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            if (name.startsWith('Service')) {
                const serviceType = name.split('_').splice(1)[0];
                const newNode = {
                    id: getId('Service'),
                    type: 'ResizableNode',
                    position,
                    data: { applicationFramework: serviceType },
                    style: {
                        border: '1px solid #ff0000',
                        width: '120px',
                        height: '40px',
                        borderRadius: '15px',
                    },
                };
                setNodes(nds => ({ ...nds, [newNode.id]: newNode }));
                setIsEmptyServiceSubmit(true);
                setServiceInputCheck(prev => ({
                    ...prev,
                    [newNode.id]: true,
                }));
            } else if (name.startsWith('Database')) {
                const prodDatabaseType = name.split('_').splice(1)[0];
                const newNode = {
                    id: getId('Database'),
                    type: 'selectorNode',
                    position,
                    data: { prodDatabaseType: prodDatabaseType, isConnected: false },
                    style: {
                        border: '1px solid red',
                        padding: '4px 4px',
                        width: '120px',
                        height: '40px',
                        borderRadius: '15px',
                    },
                };
                setNodes(nds => ({ ...nds, [newNode.id]: newNode }));
            } else if (name.startsWith('Discovery') && servicecount === 0) {
                const serviceDiscoveryType = name.split('_').splice(1)[0];
                const newNode = {
                    id: 'serviceDiscoveryType',
                    type: 'selectorNode1',
                    position,
                    data: { serviceDiscoveryType: serviceDiscoveryType },
                    style: { border: '1px solid #ff0000', padding: '4px 4px', width: '120px', height: '40px', borderRadius: '15px' },
                };
                setNodes(nds => ({ ...nds, [newNode.id]: newNode }));
                setIsServiceDiscovery(true);
                setServiceDiscoveryCount(1);
            } else if (name.startsWith('Discovery') && servicecount >= 1) {
                setServiceDiscoveryCount(2);
            } else if (name.startsWith('Auth') && authcount === 0) {
                const authenticationType = name.split('_').splice(1)[0];
                const newNode = {
                    id: 'authenticationType',
                    type: 'selectorNode3',
                    position,
                    data: { authenticationType: authenticationType },
                    style: { border: '1px solid #ff0000', padding: '4px 4px', width: '120px', height: '40px', borderRadius: '15px' },
                };
                setNodes(nds => ({ ...nds, [newNode.id]: newNode }));
                setAuthProviderCount(1);
            } else if (name.startsWith('Auth') && authcount >= 1) {
                setAuthProviderCount(2);
            } else if (name.startsWith('MessageBroker') && messagecount === 0) {
                const messageBroker = name.split('_').splice(1)[0];
                const newNode = {
                    id: 'messageBroker',
                    type: 'selectorNode4',
                    position,
                    data: { messageBroker: messageBroker },
                    style: { border: '1px solid', padding: '4px 4px' },
                };
                setNodes(nds => ({ ...nds, [newNode.id]: newNode }));
                setIsMessageBroker(true);
                setMessageBrokerCount(1);
            } else if (name.startsWith('Group')) {
                const newNode = {
                    id: getId(name),
                    type: 'GroupNode',
                    position,
                    data: { label: name },
                    style: {
                        border: '1px dashed',
                        borderRadius: '15px',
                        width: '120px',
                        height: '40px',
                        zIndex: -1,
                    },
                };
                setNodes(nds => ({ ...nds, [newNode.id]: newNode }));
            } else if (name.startsWith('MessageBroker') && messagecount >= 1) {
                setMessageBrokerCount(2);
            } else if (name.startsWith('Load') && loadcount === 0) {
                const logManagementType = name.split('_').splice(1)[0];
                const newNode = {
                    id: 'logManagement',
                    type: 'selectorNode6',
                    position,
                    data: { logManagementType: logManagementType },
                    style: { border: '1px solid #ff0000', padding: '4px 4px', width: '120px', height: '40px', borderRadius: '15px' },
                };
                setNodes(nds => ({ ...nds, [newNode.id]: newNode }));
                setLogManagementCount(1);
            } else if (name.startsWith('Load') && loadcount >= 1) {
                setLogManagementCount(2);
            } else if (name.startsWith('Localenvironment') && Localenvcount === 0) {
                const Localenvironment = name.split('_').splice(1)[0];
                const newNode = {
                    id: 'Localenvironment',
                    type: 'selectorNode7',
                    position,
                    data: { Localenvironment: Localenvironment },
                    style: { border: '1px solid', padding: '4px 4px' },
                };
                setNodes(nds => ({ ...nds, [newNode.id]: newNode }));
                setLocalenvironmentCount(1);
            } else if (name.startsWith('Localenvironment') && Localenvcount >= 1) {
                setLocalenvironmentCount(2);
            } else if (name.startsWith('Gateway')) {
                const newNode = {
                    id: getId('Gateway'),
                    type: 'ResizableNode',
                    position,
                    data: {},
                    style: {
                        border: '1px solid #ff0000',
                        width: '120px',
                        height: '40px',
                        borderRadius: '15px',
                    },
                };
                setNodes(nds => ({ ...nds, [newNode.id]: newNode }));
                setIsEmptyGatewaySubmit(true);
                setGatewayInputCheck(prev => ({
                    ...prev,
                    [newNode.id]: true,
                }));
                setIsGatewayNodeEnabled(true);
            } else if (
                (name.startsWith('UI_docusaurus') && docsCount == 0) ||
                ((name.startsWith('UI_react') || name.startsWith('UI_angular')) && UICount == 0)
            ) {
                const uiType = name.split('_').splice(1)[0];
                var clientFramework;
                var packageName;
                if (uiType == 'docusaurus') {
                    clientFramework = 'no';
                    packageName = 'docs';
                    setDocsCount(1);
                } else {
                    clientFramework = uiType;
                    packageName = 'ui';
                    setUiCount(1);
                }

                const newNode = {
                    id: getId('UI'),
                    type: 'ResizableNode',
                    position,
                    data: {
                        clientFramework: clientFramework,
                        applicationFramework: uiType,
                        packageName: packageName,
                    },
                    style: {
                        border: '1px solid #ff0000',
                        width: '120px',
                        height: '40px',
                        borderRadius: '15px',
                    },
                };
                setNodes(nds => ({ ...nds, [newNode.id]: newNode }));
                setIsEmptyUiSubmit(true);
                setUiInputCheck(prev => ({
                    ...prev,
                    [newNode.id]: true,
                }));
                // uiCount++;
                // if (uiCount == 2) setIsUINodeEnabled(true);
            } else if (name.startsWith('UI_docusaurus') && docsCount >= 1) {
                setDocsCount(2);
            } else if ((name.startsWith('UI_react') || name.startsWith('UI_angular')) && UICount >= 1) {
                setUiCount(2);
            }
        },
        [reactFlowInstance],
    );

    const { parentId, id } = useParams();
    const [projectParentId, setProjectParentId] = useState(parentId || location.state?.parentId);
    const [projectName, setProjectName] = useState(null);

    const loadData = async () => {
        if (initialized && parentId && id) {
            try {
                var response;
                if (parentId === 'Admin') {
                    response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/refArchs/' + id, {
                        method: 'get',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                        },
                    });
                } else {
                    response = await fetch(process.env.REACT_APP_API_BASE_URL + '/blueprints/' + id, {
                        method: 'get',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                        },
                    });
                }
                if (response.ok) {
                    const result = await response.json();
                    if (result?.metadata) {
                        if (parentId === 'Admin') setProjectParentId(parentId);
                        else setProjectParentId(result.parentId);
                        setProjectName(result.request_json?.projectName);
                        return await result;
                    }
                } else {
                    throw new Error(`Fetch request failed with status: ${response.status}`);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const initData = data => {
        if (data != null && !(Object.keys(data).length === 0) && data?.metadata?.nodes) {
            const nodes = data?.metadata?.nodes;
            if (!(Object.keys(nodes).length === 0)) setShowDiv(false);
            let max_groupId = -1;
            let max_serviceId = -1;
            let max_gatewayId = -1;
            let max_uiId = -1;
            let max_databaseId = -1;
            for (const key in nodes) {
                if (key.toLowerCase().includes('servicediscovery')) {
                    setIsServiceDiscovery(true);
                    setServiceDiscoveryCount(1);
                } else if (key.toLowerCase().includes('service')) {
                    const id = key.split('_');
                    const numberId = parseInt(id[1], 10);
                    max_serviceId = Math.max(numberId, max_serviceId);
                    setUniqueApplicationNames(prev => [...prev, data.metadata.nodes[key].data.label]);
                    setUniquePortNumbers(prev => [...prev, data.metadata.nodes[key].data.serverPort]);
                    setServiceInputCheck(prev => ({
                        ...prev,
                        [key.id]: false,
                    }));
                } else if (key.toLowerCase().includes('gateway')) {
                    const id = key.split('_');
                    const numberId = parseInt(id[1], 10);
                    max_gatewayId = Math.max(numberId, max_gatewayId);
                    setUniqueApplicationNames(prev => [...prev, data.metadata.nodes[key].data.label]);
                    setUniquePortNumbers(prev => [...prev, data.metadata.nodes[key].data.serverPort]);
                    setGatewayInputCheck(prev => ({
                        ...prev,
                        [key.id]: false,
                    }));
                    setIsGatewayNodeEnabled(true);
                } else if (key.toLowerCase().includes('database')) {
                    databaseId++;
                } else if (key.toLowerCase().includes('group')) {
                    groupId++;
                } else if (key.toLowerCase().includes('auth')) {
                    setAuthProviderCount(1);
                } else if (key.toLowerCase().includes('messagebroker')) {
                    setIsMessageBroker(true);
                    setMessageBrokerCount(1);
                } else if (key.toLowerCase().includes('logmanagement')) {
                    setLogManagementCount(1);
                } else if (key.toLowerCase().includes('localenvironment')) {
                    setLocalenvironmentCount(1);
                } else if (key.toLowerCase().includes('ui')) {
                    const id = key.split('_');
                    const numberId = parseInt(id[1], 10);
                    max_uiId = Math.max(numberId, max_uiId);
                    uiCount++;
                    if (nodes[key].data?.applicationFramework) {
                        setApplicationData(prev => ({
                            ...prev,
                            [nodes[key].data?.applicationFramework]: true,
                        }));
                    }
                    if (nodes[key].data?.applicationFramework === 'docusaurus') {
                        setDocsCount(1);
                    } else if (nodes[key].data?.applicationFramework === 'react' || nodes[key].data?.applicationFramework === 'angular') {
                        setUiCount(1);
                    }
                    if (uiCount == 2) setIsUINodeEnabled(true);
                    setUniqueApplicationNames(prev => [...prev, data.metadata.nodes[key].data.label]);
                    setUniquePortNumbers(prev => [...prev, data.metadata.nodes[key].data.serverPort]);
                    setUiInputCheck(prev => ({
                        ...prev,
                        [key.id]: false,
                    }));
                }
            }
            if (max_serviceId != -1) serviceId = max_serviceId + 1;
            if (max_databaseId != -1) databaseId = max_databaseId + 1;
            if (max_gatewayId != -1) gatewayId = max_gatewayId + 1;
            if (max_uiId != -1) uiId = max_uiId + 1;
            if (max_groupId != -1) groupId = max_groupId + 1;
        }
    };

    useEffect(() => {
        document.title = 'WDA';
        setShowDiv(sharedMetadata ? false : true);
        let data = location?.state;
        if (parentId) {
            if (!id) {
                setProjectParentId(parentId);
                if (localStorage?.data != undefined && localStorage.data != null && localStorage.data?.metadata?.nodes != '') {
                    data = JSON.parse(localStorage.data);
                    setuserData(data);
                    if (data?.metadata?.nodes) {
                        const nodee = data?.metadata?.nodes;
                        if (!(Object.keys(nodee).length === 0)) {
                            setShowDiv(false);
                            setNodes(data?.metadata.nodes);
                        }
                    }
                    if (data.metadata?.edges) {
                        setEdges(data?.metadata.edges);
                    }
                    if (data?.updated) {
                        setUpdated(data.updated);
                    }
                }
                initData(data);
                return;
            }
            const fetchData = async () => {
                const fetchedData = await loadData();
                if (fetchedData?.metadata?.nodes) {
                    setShowDiv(false);
                    setNodes(fetchedData?.metadata.nodes);
                }
                if (fetchedData.metadata?.edges) {
                    setEdges(fetchedData?.metadata.edges);
                }
                initData(fetchedData);
            };
            fetchData();
        } else if (!data) {
            if (localStorage?.data != undefined && localStorage.data != null && JSON.parse(localStorage.data)?.metadata?.nodes != '') {
                data = JSON.parse(localStorage.data);
                setuserData(data);
                if (data?.metadata?.nodes) {
                    const nodee = data?.metadata?.nodes;
                    if (!(Object.keys(nodee).length === 0)) {
                        setShowDiv(false);
                        setNodes(data?.metadata.nodes);
                    }
                }
                if (data.metadata?.edges) {
                    setEdges(data?.metadata.edges);
                }
                if (data?.updated) {
                    setUpdated(data.updated);
                }
            }
            initData(data);
        } else {
            setuserData(data);
            if (data?.metadata?.nodes) {
                setShowDiv(false);
                setNodes({ ...data?.metadata.nodes });
            }
            if (data.metadata?.edges) {
                setEdges({ ...data?.metadata.edges });
            }
            initData(data);
        }

        return () => {
            localStorage.clear();
            serviceId = 1;
            databaseId = 1;
            groupId = 1;
            uiId = 1;
            gatewayId = 1;
            uiCount = 0;
            setUpdated(false);
        };
    }, []);

    useEffect(() => {
        if (update && userData.project_id) {
            var data = { ...userData };
            data.metadata.nodes = nodes;
            if (Object.keys(nodes).length === 0) setShowDiv(true);
            else setShowDiv(false);
            (data.metadata ??= {}).edges = edges;
            data.updated = updated;
            setuserData(data);
            if (!(Object.keys(data).length === 0)) {
                localStorage.data = JSON.stringify(data);
            }
        }
        if (!update) {
            try {
                if (localStorage?.data && JSON.parse(localStorage.data)?.projectName) {
                    userData.projectName = JSON.parse(localStorage.data).projectName;
                }
                if (localStorage?.data && JSON.parse(localStorage.data)?.updated) {
                    userData.updated = JSON.parse(localStorage.data).updated;
                }
                var udata = { ...userData };
                (udata.metadata ??= {}).nodes = nodes;
                if (Object.keys(nodes).length === 0) setShowDiv(true);
                else setShowDiv(false);
                udata.metadata.edges = edges;
                if (localStorage?.data && JSON.parse(localStorage.data)?.metadata?.deployment) {
                    udata.metadata.deployment = JSON.parse(localStorage.data).metadata.deployment;
                }
                setuserData(udata);
                if (!(Object.keys(udata).length === 0)) {
                    localStorage.data = JSON.stringify(udata);
                }
            } catch (error) {
                console.error('error');
            }
        }
    }, [nodes, edges]);

    useEffect(() => {
        if (triggerExit.onOk) {
            handleGoToIntendedPage(triggerExit.path);
            localStorage.clear();
            clear();
            setShowDiv(true);
        }
        let unblock;
        if (!(Object.keys(nodes).length === 0) && updated) {
            unblock = history.block(location => {
                setVisibleDialog(true);
                setActionModalType('clearAndNav');
                setTriggerExit(obj => ({ ...obj, path: location.pathname }));
                if (triggerExit.onOk) {
                    return true;
                }
                return false;
            });
        }
        return () => {
            if (unblock) {
                unblock();
            }
        };
    }, [handleGoToIntendedPage, history, triggerExit.onOk, triggerExit.path, updated]);

    const onChange = Data => {
        setUpdated(true);
        if (Data.applicationFramework === 'ui' || Data.applicationFramework === 'docusaurus') {
            if (nodes[Isopen].data?.applicationFramework) {
                setApplicationData(prev => ({
                    ...prev,
                    [nodes[Isopen].data?.applicationFramework]: false,
                }));
            }
            if (Data?.applicationFramework) {
                setApplicationData(prev => ({
                    ...prev,
                    [Data.applicationFramework]: true,
                }));
            }
        }
        let allGatewayDetailsFilled = false;
        for (let key in gatewayInputCheck) {
            if (key.startsWith('Gateway')) {
                if (key !== Isopen && gatewayInputCheck[key] === true) {
                    allGatewayDetailsFilled = true;
                    setIsEmptyGatewaySubmit(true);
                }
                if (key.startsWith('Gateway') && Isopen === key) {
                    const styleData = gatewayInputCheck[key];
                    if (styleData) {
                        let updatedNodes = { ...nodes };
                        updatedNodes[key].style.border = '1px solid black';
                        setNodes(updatedNodes);
                    }
                }
            }
        }
        if (!allGatewayDetailsFilled) {
            setIsEmptyGatewaySubmit(false);
        }
        setGatewayInputCheck(prev => ({
            ...prev,
            [Isopen]: false,
        }));

        let allUiDetailsFilled = false;
        for (let key in uiInputCheck) {
            if (key.startsWith('UI')) {
                if (key !== Isopen && uiInputCheck[key] === true) {
                    allUiDetailsFilled = true;
                    setIsEmptyUiSubmit(true);
                }
                if (key.startsWith('UI') && Isopen === key) {
                    const styleData = uiInputCheck[key];
                    if (styleData) {
                        let updatedNodes = { ...nodes };
                        updatedNodes[key].style.border = '1px solid black';
                        setNodes(updatedNodes);
                    }
                }
            }
        }
        if (!allUiDetailsFilled) {
            setIsEmptyUiSubmit(false);
        }
        setUiInputCheck(prev => ({
            ...prev,
            [Isopen]: false,
        }));
        let allServiceDetailsFilled = false;
        for (let key in serviceInputCheck) {
            if (key.startsWith('Service')) {
                if (key !== Isopen && serviceInputCheck[key] === true) {
                    allServiceDetailsFilled = true;
                    setIsEmptyServiceSubmit(true);
                }
                if (key.startsWith('Service') && Isopen === key) {
                    const styleData = serviceInputCheck[key];
                    if (styleData) {
                        let updatedNodes = { ...nodes };
                        updatedNodes[key].style.border = '1px solid black';
                        setNodes(updatedNodes);
                    }
                }
            }
        }
        if (!allServiceDetailsFilled) {
            setIsEmptyServiceSubmit(false);
        }
        setServiceInputCheck(prev => ({
            ...prev,
            [Isopen]: false,
        }));

        let UpdatedNodes = { ...nodes };
        if (Data.applicationName) {
            Data.applicationName = Data.applicationName.trim();
            Data.label = Data.label.trim();
        }
        if (Isopen === 'aws' || Isopen === 'azure') {
            UpdatedNodes['cloudProvider'].data = {
                ...UpdatedNodes['cloudProvider'].data,
                ...Data,
            };
            if (UpdatedNodes['cloudProvider'].data.kubernetesUseDynamicStorage === 'false')
                delete UpdatedNodes['cloudProvider'].data.kubernetesStorageClassName;
        } else if (Data?.type === 'Group') {
            UpdatedNodes[Isopen].data = { ...UpdatedNodes[Isopen].data, ...Data };
        } else {
            if (CurrentNode?.applicationName) {
                setUniqueApplicationNames(prev => prev.filter(appName => CurrentNode.applicationName !== appName));
            }
            setUniqueApplicationNames(prev => [...prev, Data.applicationName]);
            if (CurrentNode?.serverPort) {
                setUniquePortNumbers(prev => prev.filter(port => CurrentNode.serverPort !== port));
            }
            setUniquePortNumbers(prev => [...prev, Data.serverPort]);
            UpdatedNodes[Isopen].data = { ...UpdatedNodes[Isopen].data, ...Data };
            UpdatedNodes[Isopen].selected = false;
            if (Isopen.startsWith('UI') && UpdatedNodes[Isopen].data?.applicationFramework === 'ui')
                delete UpdatedNodes[Isopen].data?.theme;
        }
        setNodes(UpdatedNodes);
        setopen(false);
    };

    const MergeData = (sourceId, targetId, Nodes) => {
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
                };
                setNodes({ ...AllNodes });
            }
        }
    };

    const [generatingData, setGeneratingData] = useState({});

    const onsubmit = (Data, submit = false) => {
        setUpdated(false);
        const NewNodes = { ...nodes };
        const NewEdges = { ...edges };

        const authEdges = [];
        const serviceRegistryEdges = [];
        const logManagementEdges = [];

        for (const key in NewEdges) {
            const edge = NewEdges[key];
            const sourceNodeId = edge.source;
            if (edge.target === 'authenticationType') {
                authEdges.push(sourceNodeId);
            } else if (edge.target === 'serviceDiscoveryType') {
                serviceRegistryEdges.push(sourceNodeId);
            } else if (edge.target === 'logManagement') {
                logManagementEdges.push(sourceNodeId);
            }
        }

        let Service_Discovery_Data = nodes['serviceDiscoveryType']?.data;
        let authenticationData = { authenticationType: 'no' };
        if (nodes['authenticationType']) authenticationData = nodes['authenticationType']?.data;
        let logManagementData = nodes['logManagement']?.data;
        if (logManagementData && Data?.deployment) Data.deployment.enableECK = 'true';
        if (Data.deployment && Service_Discovery_Data?.serviceDiscoveryType)
            Data.deployment = { ...Data.deployment, ...Service_Discovery_Data };

        for (const key in NewNodes) {
            const Node = NewNodes[key];
            delete Node.data?.color;
            if (Node.id.startsWith('Service') || Node.id.startsWith('UI') || Node.id.startsWith('Gateway')) {
                if (serviceRegistryEdges.includes(Node.id)) {
                    Node.data = {
                        ...Node.data,
                        ...Service_Discovery_Data,
                    };
                } else if (Node.data?.serviceDiscoveryType) {
                    delete Node.data.serviceDiscoveryType;
                }
                if (authEdges.includes(Node.id)) {
                    Node.data = {
                        ...Node.data,
                        ...authenticationData,
                    };
                } else {
                    Node.data = {
                        ...Node.data,
                        ['authenticationType']: 'no',
                    };
                }
                if (logManagementEdges.includes(Node.id)) {
                    Node.data = {
                        ...Node.data,
                        ...logManagementData,
                    };
                } else if (Node.data?.logManagementType) {
                    delete Node.data.logManagementType;
                }
            }

            if (Node.id.startsWith('UI')) {
                if (Node.data.applicationFramework === 'docusaurus') {
                    Node.data.packageName = 'docs';
                } else {
                    Node.data.applicationFramework = Node.data.clientFramework;
                    Node.data.packageName = 'ui';
                }
            }
        }
        if (Object.values(NewNodes).some(node => node.data)) {
            Data['services'] = {};
            let serviceIndex = 0;
            for (const nodeInfo in NewNodes) {
                const Node = NewNodes[nodeInfo];
                if (Node.data) {
                    if (Node.id.startsWith('Service') || Node.id.startsWith('UI') || Node.id.startsWith('Gateway')) {
                        Data['services'][serviceIndex++] = Node.data;
                    }
                }
            }
        }
        if (Object.values(NewEdges).some(edge => edge.data && JSON.stringify(edge.data) !== '{}')) {
            Data['communications'] = {};
            let communicationIndex = 0;
            for (const edgeInfo in NewEdges) {
                const Edge = NewEdges[edgeInfo];
                if (!Edge.target.startsWith('Database')) {
                    Edge.data.client = nodes[Edge.source].data.applicationName;
                    Edge.data.server = nodes[Edge.target].data.applicationName;
                    if (Edge.data && Object.keys(Edge.data).length !== 0 && !Edge.target.startsWith('Database'))
                        Data['communications'][communicationIndex++] = Edge.data;
                }
            }
        }
        if (saveMetadata || id) {
            Data['metadata'] = {
                nodes: nodes,
                edges: edges,
                deployment: Data?.deployment,
            };
        } else delete Data?.metadata;
        if (id) {
            Data.projectId = id;
        }
        if (projectParentId) {
            Data.parentId = projectParentId;
        }
        setNodes(NewNodes);
        setGeneratingData(structuredClone(Data));
        setIsLoading(true);

        if (submit) {
            generateZip(null, Data);
        }
    };

    //

    const [isGenerating, setIsGenerating] = useState(false);
    const [image, setImage] = useState(null);

    const generateZip = async (e, data = null) => {
        const Data = data || generatingData;
        const generatedImage = await CreateImage(Object.values(nodes));
        setIsGenerating(true);
        if (generatedImage) Data.imageUrl = generatedImage;
        try {
            const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/generate', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
                body: JSON.stringify(Data),
            });

            const blob = await response.blob();
            setIsGenerating(false);
            saveAs(blob, `${Data.projectName}.zip`);
        } catch (error) {
            console.error(error);
        } finally {
            localStorage.clear();
            if (initialized && keycloak.authenticated) {
                clear();
                if (parentId === 'Admin') {
                    history.replace('/architectures');
                } else {
                    history.replace('/project/' + projectParentId + '/architectures');
                }
            } else {
                clear();
                setIsLoading(false);
                history.push('/canvasToCode');
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

    const onEdgeClick = (e, edge) => {
        let updatedEdges = { ...edges };
        const sourceType = edge.source.split('_')[0];
        const targetType = edge.target.split('_')[0];
        if (sourceType === 'Service' && targetType === 'Service') {
            setEdgeopen(edge.id);
            setCurrentEdge(edges[edge.id].data);
        }
        for (var existingEdge in updatedEdges) {
            if (existingEdge.id != edge.id) {
                updatedEdges[existingEdge.id].selected = false;
            }
        }
        updatedEdges[edge.id].selected = true;
        setEdges(updatedEdges);
    };

    const handleEdgeData = Data => {
        let UpdatedEdges = { ...edges };
        if (Data.framework === 'rest-api') {
            UpdatedEdges[IsEdgeopen].label = 'Rest';
        } else {
            UpdatedEdges[IsEdgeopen].label = 'RabbitMQ';
        }

        if (Data.type === 'synchronous') {
            UpdatedEdges[IsEdgeopen].markerEnd = {
                color: 'black',
                type: MarkerType.ArrowClosed,
            };
            UpdatedEdges[IsEdgeopen].className = 'success';
        } else {
            UpdatedEdges[IsEdgeopen].markerEnd = {
                color: '#bcbaba',
                type: MarkerType.ArrowClosed,
            };
            UpdatedEdges[IsEdgeopen].className = 'grey';
        }

        UpdatedEdges[IsEdgeopen].data = {
            client: UpdatedEdges[IsEdgeopen].source,
            server: UpdatedEdges[IsEdgeopen].target,
            ...UpdatedEdges[IsEdgeopen].data,
            ...Data,
        };
        UpdatedEdges[IsEdgeopen].selected = false;

        setEdges(UpdatedEdges);
        setEdgeopen(false);
    };

    const toast = useToast({
        containerStyle: {
            width: '500px',
            maxWidth: '100%',
        },
    });

    const toastIdRef = useRef();

    const onConnect = useCallback(
        (params, Nodes) => {
            setUpdated(true);
            params.markerEnd = { type: MarkerType.ArrowClosed };
            params.type = 'smoothstep';
            params.data = {};
            const targetNode = Nodes[params.target];
            const sourceNode = Nodes[params.source];
            var errorMessage = null;
            if (sourceNode.id.startsWith('UI') && targetNode.id.startsWith('Database')) {
                errorMessage = 'UI Cannot be connected to a Database';
            } else if (sourceNode.id.startsWith('Gateway') && targetNode.id.startsWith('UI')) {
                errorMessage = 'Communication from Gateway to UI is not possible';
            } else if (sourceNode.id.startsWith('Service') && targetNode.id.startsWith('Gateway')) {
                errorMessage = 'Communication from Service to Gateway is not possible';
            }
            if (errorMessage !== null) {
                toast.close(toastIdRef.current);
                toastIdRef.current = toast({
                    title: errorMessage,
                    status: 'error',
                    duration: 3000,
                    variant: 'left-accent',
                    isClosable: true,
                });
            }
            if (targetNode.id.startsWith('auth') || targetNode.id.startsWith('log') || targetNode.id.startsWith('serviceDiscovery')) {
                setEdges(eds => addEdge(params, eds, Nodes));
                setNodes(nodes => {
                    var updatedNodes = { ...nodes };
                    updatedNodes[targetNode.id].style.border = '1px solid';
                    return updatedNodes;
                });
                return;
            }
            if (sourceNode.id.startsWith('UI') && targetNode.id.startsWith('Service')) {
                const gatewayNodes = Object.values(nodes).filter(node => node.id.startsWith('Gateway'));
                const uiConnectToService = gatewayNodes.some(gatewayNode => {
                    const uiToGatewayEdge = edges[`${sourceNode.id}-${gatewayNode.id}`];
                    const gatewayToServiceEdge = edges[`${gatewayNode.id}-${targetNode.id}`];
                    return uiToGatewayEdge && gatewayToServiceEdge;
                });
                if (uiConnectToService) {
                    return;
                }
            }
            if (sourceNode.id.startsWith('UI') && targetNode.id.startsWith('Gateway')) {
                const connectedServices = Object.values(nodes).filter(
                    node => node.id.startsWith('Service') && edges[`${sourceNode.id}-${node.id}`],
                );
                const connectedServicesToGateway = connectedServices.filter(serviceNode => {
                    const edgeToGateway = edges[`${targetNode.id}-${serviceNode.id}`];
                    return edgeToGateway;
                });
                connectedServicesToGateway.forEach(serviceNode => {
                    const edgeToRemove = `${sourceNode.id}-${serviceNode.id}`;
                    setEdges(eds => {
                        const updatedEdges = { ...eds };
                        delete updatedEdges[edgeToRemove];
                        return updatedEdges;
                    });
                });
                setEdges(eds => {
                    const updatedEdges = addEdge(params, eds, Nodes);
                    const newEdgeId = `${sourceNode.id}-${targetNode.id}`;
                    const Data = {
                        type: 'synchronous',
                        framework: 'rest-api',
                    };
                    updatedEdges[newEdgeId].markerEnd = {
                        color: 'black',
                        type: MarkerType.ArrowClosed,
                    };
                    updatedEdges[newEdgeId].className = 'success';
                    updatedEdges[newEdgeId].data = {
                        client: updatedEdges[newEdgeId].source,
                        server: updatedEdges[newEdgeId].target,
                        ...updatedEdges[newEdgeId].data,
                        ...Data,
                    };
                    return updatedEdges;
                });
                return;
            }

            if (sourceNode.id.startsWith('Gateway') && targetNode.id.startsWith('Service')) {
                const connectedUIToServices = Object.values(Nodes).filter(
                    node => node.id.startsWith('UI') && edges[`${node.id}-${targetNode.id}`],
                );
                const connectedUIToGateway = connectedUIToServices.filter(uiNode => {
                    const edgeToGateway = edges[`${uiNode.id}-${sourceNode.id}`];
                    return edgeToGateway;
                });
                connectedUIToGateway.forEach(uiNode => {
                    const edgeToRemove = `${uiNode.id}-${targetNode.id}`;
                    setEdges(eds => {
                        const updatedEdges = { ...eds };
                        delete updatedEdges[edgeToRemove];
                        return updatedEdges;
                    });
                });
                setEdges(eds => {
                    const updatedEdges = addEdge(params, eds, Nodes);
                    const newEdgeId = `${sourceNode.id}-${targetNode.id}`;
                    const Data = {
                        type: 'synchronous',
                        framework: 'rest-api',
                    };
                    updatedEdges[newEdgeId].markerEnd = {
                        color: 'black',
                        type: MarkerType.ArrowClosed,
                    };
                    updatedEdges[newEdgeId].className = 'success';
                    updatedEdges[newEdgeId].data = {
                        client: updatedEdges[newEdgeId].source,
                        server: updatedEdges[newEdgeId].target,
                        ...updatedEdges[newEdgeId].data,
                        ...Data,
                    };
                    return updatedEdges;
                });
                return;
            }

            if (
                !(
                    targetNode.id.startsWith('UI') ||
                    (targetNode.id.startsWith('Database') && sourceNode.id.startsWith('UI')) ||
                    (targetNode.id.startsWith('Gateway') && sourceNode.id.startsWith('Service')) ||
                    sourceNode?.data.applicationFramework === 'docusaurus'
                )
            ) {
                if (targetNode.id.startsWith('Database')) {
                    let isServiceConnected = Nodes[params.source]?.data['prodDatabaseType'];
                    if (!isServiceConnected && !targetNode.data.isConnected && !sourceNode.id.startsWith('UI')) {
                        targetNode.data.isConnected = true;
                        setEdges(eds => addEdge(params, eds, Nodes));
                        MergeData(params.source, params.target, Nodes);
                    }
                    if (!isServiceConnected) {
                        let updatedNodes = { ...Nodes };
                        if (updatedNodes[targetNode?.id]?.style) {
                            updatedNodes[targetNode?.id].style.border = '1px solid black';
                        }
                        setNodes(updatedNodes);
                    }
                } else if (targetNode.id.startsWith('Gateway') || sourceNode.id.startsWith('Gateway') || sourceNode.id.startsWith('UI')) {
                    setEdges(eds => {
                        const updatedEdges = addEdge(params, eds, Nodes);
                        const newEdgeId = `${sourceNode.id}-${targetNode.id}`;
                        const Data = {
                            type: 'synchronous',
                            framework: 'rest-api',
                        };
                        updatedEdges[newEdgeId].markerEnd = {
                            color: 'black',
                            type: MarkerType.ArrowClosed,
                        };
                        updatedEdges[newEdgeId].className = 'success';
                        updatedEdges[newEdgeId].data = {
                            client: updatedEdges[newEdgeId].source,
                            server: updatedEdges[newEdgeId].target,
                            ...updatedEdges[newEdgeId].data,
                            ...Data,
                        };
                        return updatedEdges;
                    });
                } else {
                    setEdges(eds => addEdge(params, eds, Nodes));
                }
            }
        },
        [edges],
    );

    const UpdateSave = () => {
        setsaveMetadata(prev => !prev);
    };

    const [uniqueApplicationNames, setUniqueApplicationNames] = useState([]);
    const [uniquePortNumbers, setUniquePortNumbers] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');

    const handleColorClick = color => {
        let UpdatedNodes = structuredClone(nodes);
        setSelectedColor(color);
        (UpdatedNodes[nodeClick].style ??= {}).backgroundColor = color;
        setNodes({ ...UpdatedNodes });
    };

    const [menu, setMenu] = useState(null);
    const ref = useRef(null);

    const onNodeContextMenu = useCallback(
        (event, node) => {
            event.preventDefault();

            const pane = ref.current.getBoundingClientRect();
            setMenu({
                id: node.id,
                node: node,
                top: event.clientY < pane.height - 200 && event.clientY,
                left: event.clientX < pane.width - 200 && event.clientX,
                right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
                bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
            });
        },
        [setMenu],
    );

    const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

    if (isLoading)
        return (
            <ReactFlowProvider>
                <ReviewFlow
                    nodesData={Object.values(nodes)}
                    edgesData={Object.values(edges)}
                    setViewOnly={setIsLoading}
                    generateZip={generateZip}
                    deployementData={generatingData}
                    generateMode
                    onSubmit={onsubmit}
                />
                {isGenerating && (
                    <Flex
                        position="fixed"
                        top="62"
                        left="0"
                        right="0"
                        bottom="0"
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor="#f5f5f5"
                        zIndex="9999"
                        display="flex"
                        flexDirection="column"
                    >
                        <Spinner thickness="8px" speed="0.9s" emptyColor="gray.200" color="#ebaf24" height="250px" width="250px" />
                        <Box>Generating the Code</Box>
                    </Flex>
                )}
            </ReactFlowProvider>
        );
    return (
        <div className="dndflow" style={{ overflow: 'hidden !important', bottom: 0, height: 'calc(100vh - 64px)' }}>
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        ref={ref}
                        nodes={Object.values(nodes)}
                        edges={Object.values(edges)}
                        nodeTypes={nodeTypes}
                        snapToGrid
                        connectionLineType={ConnectionLineType.Step}
                        snapGrid={[10, 10]}
                        onNodesChange={changes => onNodesChange(setShowDiv, edges, changes)}
                        onEdgesChange={changes => onEdgesChange(nodes, changes)}
                        onConnect={params => onConnect(params, nodes)}
                        onInit={setReactFlowInstance}
                        onNodeDoubleClick={onclick}
                        onDrop={e =>
                            onDrop(
                                e,
                                ServiceDiscoveryCount,
                                MessageBrokerCount,
                                LogManagemntCount,
                                AuthProviderCount,
                                LocalenvironmentCount,
                                UICount,
                                docsCount,
                            )
                        }
                        onDragOver={onDragOver}
                        onDragLeave={() => setShowDiv(Object.keys(nodes).length === 0)}
                        // onNodeClick={onSingleClick}
                        deleteKeyCode={['Backspace', 'Delete']}
                        fitView
                        // onEdgeUpdate={(oldEdge, newConnection) => onEdgeUpdate(nodes, oldEdge, newConnection)}
                        onEdgeUpdateStart={onEdgeUpdateStart}
                        onEdgeUpdateEnd={(_, edge) => onEdgeUpdateEnd(nodes, edge)}
                        onEdgeClick={!viewOnly ? onEdgeClick : ''}
                        defaultViewport={defaultViewport}
                        nodesDraggable={!viewOnly}
                        elementsSelectable={!viewOnly}
                        nodesConnectable={!viewOnly}
                        onPaneClick={onPaneClick}
                        onNodeContextMenu={onNodeContextMenu}
                    >
                        {menu && <ContextMenu onClick={onPaneClick} {...menu} onEditClick={!viewOnly ? onclick : () => {}} />}
                        <Flex>
                            <Sidebar
                                isUINodeEnabled={isUINodeEnabled}
                                isGatewayNodeEnabled={isGatewayNodeEnabled}
                                Service_Discovery_Data={nodes['serviceDiscoveryType']?.data}
                                authenticationData={nodes['authenticationType']?.data}
                                nodes={nodes}
                                architectureName={projectName}
                                onSubmit={onsubmit}
                                saveMetadata={saveMetadata}
                                Togglesave={UpdateSave}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                                isEmptyUiSubmit={isEmptyUiSubmit}
                                isEmptyServiceSubmit={isEmptyServiceSubmit}
                                isEmptyGatewaySubmit={isEmptyGatewaySubmit}
                                selectedColor={selectedColor}
                                serviceDiscoveryCount={ServiceDiscoveryCount}
                                logManagementCount={LogManagemntCount}
                                authProviderCount={AuthProviderCount}
                                nodeClick={nodeClick}
                                edges={edges}
                                update={update}
                                updated={updated}
                                setUpdated={setUpdated}
                                triggerExit={triggerExit}
                                viewOnly={viewOnly}
                                id={id}
                            />
                            {showDiv && (
                                <Box
                                    flex={'1'}
                                    display={'flex'}
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    transition={'all 3s ease-in-out'}
                                >
                                    <Box
                                        style={{
                                            border: '2px dashed #cfcfcf',
                                            borderRadius: '8px',
                                            zIndex: 1,
                                            display: 'grid',
                                            justifyItems: 'center',
                                            margin: '50px',
                                            padding: '50px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                marginBottom: '20px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <FiUploadCloud
                                                style={{
                                                    fontSize: '62px',
                                                    color: '#c3c3c3',
                                                    marginBottom: '30px',
                                                }}
                                            />
                                        </div>
                                        <Text
                                            style={{
                                                fontSize: '38px',
                                                fontWeight: '500',
                                                marginBottom: '10px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            Design your application architecture here
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: '24px',
                                                fontWeight: '300',
                                                marginBottom: '30px',
                                                color: '#c3c3c3',
                                                textAlign: 'center',
                                            }}
                                        >
                                            Click next to auto generate code and setup infrastructure
                                        </Text>
                                        <Button
                                        // mt={4}
                                        // border="2px"
                                        // borderColor="#ebaf24"
                                        // alignContent="center"
                                        // color="#ebaf24"
                                        // style={{ margin: '0 auto' }}
                                        >
                                            Drag & Drop <ArrowRightIcon style={{ marginLeft: '10px', fontSize: '11px' }} />
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Flex>
                        <Controls showInteractive={!viewOnly} />
                        <Panel position="top-right">
                            <VStack spacing={4} alignItems={'stretch'}>
                                <Button
                                    hidden={true}
                                    colorScheme="blackAlpha"
                                    size="sm"
                                    onClick={() => console.log(nodes, edges, userData, projectParentId, projectName, generatingData)}
                                >
                                    Print
                                </Button>
                                <DownloadButton />
                                <IconButton
                                    hidden={viewOnly}
                                    icon={<Icon as={AiOutlineClear} />}
                                    size="md"
                                    onClick={() => {
                                        if (!(Object.keys(nodes).length === 0) && updated) {
                                            setVisibleDialog(true);
                                            setActionModalType('clear');
                                        }
                                    }}
                                />
                            </VStack>
                        </Panel>
                        <Background gap={10} color="#f2f2f2" variant={BackgroundVariant.Lines} />
                    </ReactFlow>
                </div>

                {nodeType === 'UI' && Isopen && (
                    <UiDataModal
                        isOpen={Isopen}
                        CurrentNode={CurrentNode}
                        onClose={setopen}
                        onSubmit={onChange}
                        handleColorClick={handleColorClick}
                        uniqueApplicationNames={uniqueApplicationNames}
                        uniquePortNumbers={uniquePortNumbers}
                        applicationData={applicationData}
                    />
                )}
                {nodeType === 'Service' && Isopen && (
                    <ServiceModal
                        isOpen={Isopen}
                        CurrentNode={CurrentNode}
                        onClose={setopen}
                        onSubmit={onChange}
                        handleColorClick={handleColorClick}
                        uniqueApplicationNames={uniqueApplicationNames}
                        uniquePortNumbers={uniquePortNumbers}
                    />
                )}
                {nodeType === 'Gateway' && Isopen && (
                    <GatewayModal
                        isOpen={Isopen}
                        CurrentNode={CurrentNode}
                        onClose={setopen}
                        onSubmit={onChange}
                        handleColorClick={handleColorClick}
                        uniqueApplicationNames={uniqueApplicationNames}
                        uniquePortNumbers={uniquePortNumbers}
                    />
                )}
                {nodeType === 'group' && Isopen && (
                    <GroupDataModal
                        isOpen={Isopen}
                        CurrentNode={CurrentNode}
                        onClose={setopen}
                        onSubmit={onChange}
                        handleColorClick={handleColorClick}
                    />
                )}

                {nodeType === 'Database' && Isopen && (
                    <CustomNodeModal
                        isOpen={Isopen}
                        CurrentNode={CurrentNode}
                        onClose={setopen}
                        onSubmit={onChange}
                        handleColorClick={handleColorClick}
                    />
                )}

                {nodeType === 'serviceDiscoveryType' && Isopen && (
                    <CustomNodeModal
                        isOpen={Isopen}
                        CurrentNode={CurrentNode}
                        onClose={setopen}
                        onSubmit={onChange}
                        handleColorClick={handleColorClick}
                    />
                )}

                {nodeType === 'authenticationType' && Isopen && (
                    <CustomNodeModal
                        isOpen={Isopen}
                        CurrentNode={CurrentNode}
                        onClose={setopen}
                        onSubmit={onChange}
                        handleColorClick={handleColorClick}
                    />
                )}

                {nodeType === 'logManagement' && Isopen && (
                    <CustomNodeModal
                        isOpen={Isopen}
                        CurrentNode={CurrentNode}
                        onClose={setopen}
                        onSubmit={onChange}
                        handleColorClick={handleColorClick}
                    />
                )}

                <ActionModal
                    isOpen={isVisibleDialog}
                    onClose={() => {
                        setVisibleDialog(false);
                        setActionModalType('clear');
                    }}
                    onSubmit={() => {
                        if (actionModalType === 'clear') {
                            clear();
                        } else {
                            setTriggerExit(obj => ({
                                ...obj,
                                onOk: true,
                            }));
                        }
                        setVisibleDialog(false);
                        setActionModalType('clear');
                    }}
                    actionType={actionModalType}
                />

                {IsEdgeopen && (
                    <EdgeModal
                        isOpen={IsEdgeopen}
                        CurrentEdge={CurrentEdge}
                        onClose={setEdgeopen}
                        handleEdgeData={handleEdgeData}
                        isMessageBroker={isMessageBroker}
                    />
                )}

                {ServiceDiscoveryCount === 2 && <AlertModal isOpen={true} onClose={() => setServiceDiscoveryCount(1)} />}

                {MessageBrokerCount === 2 && <AlertModal isOpen={true} onClose={() => setMessageBrokerCount(1)} />}

                {CloudProviderCount === 2 && <AlertModal isOpen={true} onClose={() => setCloudProviderCount(1)} />}
                {LogManagemntCount === 2 && <AlertModal isOpen={true} onClose={() => setLogManagementCount(1)} />}
                {LocalenvironmentCount === 2 && <AlertModal isOpen={true} onClose={() => setLocalenvironmentCount(1)} />}
                {AuthProviderCount === 2 && <AlertModal isOpen={true} onClose={() => setAuthProviderCount(1)} />}
                {UICount === 2 && <AlertModal isOpen={true} onClose={() => setUiCount(1)} />}
                {docsCount === 2 && <AlertModal isOpen={true} onClose={() => setDocsCount(1)} />}
            </ReactFlowProvider>
        </div>
    );
};

export default Designer;
