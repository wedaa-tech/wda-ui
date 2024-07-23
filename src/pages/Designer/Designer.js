import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { ReactFlowProvider, Controls, MarkerType, ConnectionLineType, Background, BackgroundVariant, Panel } from 'reactflow';
import { AiOutlineSave } from 'react-icons/ai';
import { saveAs } from 'file-saver';
import { FaEraser } from 'react-icons/fa6';
import { GoCodeReview } from 'react-icons/go';
import 'reactflow/dist/style.css';
import { Button, Flex, Icon, IconButton, Text, VStack, useToast, Tooltip, Box, HStack,Spinner } from '@chakra-ui/react';
import Sidebar from './../../components/Sidebar';
import CustomImageNode from './../Customnodes/CustomImageNode';
import CustomServiceNode from './../Customnodes/CustomServiceNode';
import CustomIngressNode from './../Customnodes/CustomIngressNode';
import CustomAuthNode from './../Customnodes/CustomAuthNode';
import CustomMessageBrokerNode from './../Customnodes/CustomMessageBrokerNode';
import CustomCloudNode from './../Customnodes/CustomCloudNode';
import CustomLoadNode from './../Customnodes/CustomLoadNode';
import AlertModal from '../../components/Modal/AlertModal';
import resizeableNode from './../Customnodes/ResizeableNode';
import groupNode from './../Customnodes/GroupNode';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import './../../App.css';
import EdgeModal from '../../components/Modal/EdgeModal';
import { useKeycloak } from '@react-keycloak/web';
import ActionModal from '../../components/Modal/ActionModal';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { ReviewFlow } from '.././Review/Review';
import DownloadButton from '../../components/DownloadButton';
import ContextMenu from '../../components/ContextMenu';
import CustomNodeModal from '../../components/Modal/CustomNodeModal';
import Generating from '../../components/Generating';
import { checkDisabled } from '../../utils/submitButtonValidation';
import CanvasContent from '../CanvasContent/CanvasContent';
import Functions from './utils';
import ApplicationModal from '../../components/Modal/ApplicationModal';

let serviceId = 1;
let gatewayId = 1;
let databaseId = 1;
let groupId = 1;
let uiId = 1;
let uiCount = 0;
let dummyId = 1;

const getId = (type = '') => {
    if (type === 'Service') return `Service_${serviceId++}`;
    else if (type === 'Database') return `Database_${databaseId++}`;
    else if (type === 'Authentication') return 'Authentication_1';
    else if (type === 'UI') return `UI_${uiId++}`;
    else if (type === 'Gateway') return `Gateway_${gatewayId++}`;
    else if (type === 'Group') return `group_${groupId++}`;
    else if (type === 'Dummy') return `dummy_${dummyId++}`;
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
    ResizableNode: resizeableNode,
    GroupNode: groupNode,
};

const Designer = ({ update, viewMode = false, sharedMetadata = undefined }) => {
    const history = useHistory();
    const [viewOnly, setViewOnly] = useState(viewMode);
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
    const [triggerExit, setTriggerExit] = useState({
        onOk: false,
        path: '',
    });
    const [projectName, setProjectName] = useState(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [Isopen, setopen] = useState(false);
    const [nodeClick, setNodeClick] = useState(false);
    const [IsEdgeopen, setEdgeopen] = useState(false);
    const [CurrentNode, setCurrentNode] = useState({});
    const [CurrentEdge, setCurrentEdge] = useState({});
    const [isMessageBroker, setIsMessageBroker] = useState(false);
    const [isServiceDiscovery, setIsServiceDiscovery] = useState(false);
    const [saveMetadata, setsaveMetadata] = useState(true);
    const [menu, setMenu] = useState(null);
    const [generatingData, setGeneratingData] = useState({});
    var { parentId, id } = useParams();
    const [projectParentId, setProjectParentId] = useState(parentId || location.state?.parentId);
    const [projectProjectId, setProjectprojectId] = useState(id);
    const [isGenerating, setIsGenerating] = useState(false);
    const [uniqueApplicationNames, setUniqueApplicationNames] = useState([]);
    const [uniquePortNumbers, setUniquePortNumbers] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [initialData, setInitialData] = useState(null);
    const [projectNames, setProjectNames] = useState([]);
    const [defaultProjectName, setDefaultProjectName] = useState('');
    const [credits, setCredits] = useState(0);
    const [userCredits,setUserCredits]=useState(0);
    const [aiServices, setAiServices] = useState([]);
    const reactFlowWrapper = useRef(null);
    const edgeUpdateSuccessful = useRef(true);
    const toastIdRef = useRef();
    const ref = useRef(null);
    const [spinner, setSpinner] = useState(false);

    const toast = useToast({
        containerStyle: {
            width: '500px',
            maxWidth: '100%',
        },
    });

    const handleGoToIntendedPage = useCallback(
        location => {
            history.push(`${location}`);
        },
        [history],
    );

    const fetchProjectNames = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/project-names', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setProjectNames(data.ProjectNames);
        } catch (error) {
            console.error('Error fetching Project Names:', error);
        }
    };

    useEffect(() => {
        if (initialized && keycloak?.authenticated) {
            loadCredits();
            fetchProjectNames();
            if (projectParentId !== 'admin') {
                let defaultProjectId;
                fetch(process.env.REACT_APP_API_BASE_URL + '/api/projects', {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                    },
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result?.data) {
                            defaultProjectId = result.data.find(project => project.name.startsWith('default'))?.id;
                            if (!defaultProjectId) {
                                fetch(process.env.REACT_APP_API_BASE_URL + '/api/projects', {
                                    method: 'post',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                                    },
                                    body: JSON.stringify({
                                        name: 'default',
                                        description: 'Default Project',
                                    }),
                                })
                                    .then(response => response.json())
                                    .then(result => {
                                        if (result?.data) {
                                            defaultProjectId = result.data.id;
                                            setProjectParentId(defaultProjectId);
                                        }
                                    })
                                    .catch(error => console.error(error));
                            } else {
                                setProjectParentId(defaultProjectId);
                            }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }
    }, [initialized, keycloak?.realmAccess?.roles, keycloak?.token]);

    useEffect(()=>{
        setCredits(userCredits-aiServices.length)
    },[userCredits,aiServices])

    useEffect(() => {
        document.title = 'WeDAA';
        setShowDiv(sharedMetadata ? false : true);
        let data = location?.state;
        if (projectParentId) {
            if (!id) {
                setProjectParentId(projectParentId);
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
                }
                initData(data);
                return;
            }
            const fetchData = async () => {
                const fetchedData = await loadData();
                setInitialData(fetchedData);
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
            serviceId = 1;
            databaseId = 1;
            groupId = 1;
            dummyId = 1;
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
        if (
            !isLoading &&
            history.location.pathname !== '/canvasToCode' &&
            history.location.pathname != '/project/admin/architecture/create' &&
            history.location.pathname != `/project/${projectParentId}/architecture/create`
        ) {
            if (triggerExit.onOk) {
                handleGoToIntendedPage(triggerExit.path);
                clear();
                setShowDiv(true);
                setProjectName('clear#canvas');
            }
            let unblock;
            var nodesfromstorage;
            if (localStorage?.data) nodesfromstorage = JSON.parse(localStorage.data)?.metadata?.nodes;
            if ((!(Object.keys(nodes).length === 0) && updated) || (nodesfromstorage && !(Object.keys(nodesfromstorage).length === 0))) {
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
        }
    }, [handleGoToIntendedPage, history, triggerExit.onOk, triggerExit.path, updated, nodes]);

    const onPaneClick = useCallback(() => setMenu(false), [setMenu]);
    const onNodesChange = useCallback((setShowDiv, edges, changes = []) => {
        setMenu(false);
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
                            Functions.onCheckEdge(edges);
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

                            if (aiServices.includes(change.id)) {
                                setAiServices(prev => prev.filter(service => service !== change.id));
                            }
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
                                if (key.split('-')[1] === 'serviceDiscoveryType') {
                                    delete updatedEdges[key];
                                }
                                setEdges(updatedEdges);
                            }
                        } else if (change.id === 'cloudProvider') {
                            setCloudProviderCount(0);
                        } else if (change.id === 'authenticationType') {
                            setAuthProviderCount(0);
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
                        if (deletedNode?.data?.databasePort) {
                            deletedApplicationPorts.push(deletedNode.data.databasePort.trim());
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
                            if (sourceId.startsWith('Service')){
                                if(UpdatedNodes[sourceId].data?.dbmlData)
                                delete UpdatedNodes[sourceId].data.dbmlData;   
                                if(UpdatedNodes[sourceId].data?.description)
                                delete UpdatedNodes[sourceId].data.description;   
                                delete UpdatedNodes[sourceId].data.prodDatabaseType;
                                setAiServices(prev => prev.filter(service => service !== sourceId));
                            }
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
    const onDragOver = useCallback(event => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        setShowDiv(false);
    }, []);
    const onDrop = useCallback(
        (event, servicecount, messagecount, loadcount, authcount, UICount, docsCount) => {
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
                var RefArchData = {
                    metadata: {
                        nodes: marketMetaData.nodes,
                    },
                };
                initData(RefArchData);
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
                        fontSize: '10px',
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
                        fontSize: '10px',
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
                    style: {
                        border: '1px solid ',
                        padding: '4px 4px',
                        width: '120px',
                        height: '40px',
                        borderRadius: '15px',
                        fontSize: '10px',
                    },
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
                    style: {
                        border: '1px solid ',
                        padding: '4px 4px',
                        width: '120px',
                        height: '40px',
                        borderRadius: '15px',
                        fontSize: '10px',
                    },
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
                    style: { border: '1px solid', padding: '4px 4px', fontSize: '10px' },
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
                        fontSize: '10px',
                    },
                };
                setNodes(nds => ({ ...nds, [newNode.id]: newNode }));
            } else if (name.startsWith('Dummy')) {
                const newNode = {
                    id: getId(name),
                    type: 'GroupNode',
                    position,
                    data: { label: name },
                    style: {
                        border: '1px solid',
                        borderRadius: '15px',
                        width: '120px',
                        height: '40px',
                        zIndex: -1,
                        fontSize: '10px',
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
                    style: {
                        border: '1px solid ',
                        padding: '4px 4px',
                        width: '120px',
                        height: '40px',
                        borderRadius: '15px',
                        fontSize: '10px',
                    },
                };
                setNodes(nds => ({ ...nds, [newNode.id]: newNode }));
                setLogManagementCount(1);
            } else if (name.startsWith('Load') && loadcount >= 1) {
                setLogManagementCount(2);
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
                        fontSize: '10px',
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
                (name.startsWith('UI_docusaurus') && docsCount === 0) ||
                ((name.startsWith('UI_react') || name.startsWith('UI_angular')) && UICount === 0)
            ) {
                const uiType = name.split('_').splice(1)[0];
                var clientFramework;
                var packageName;
                if (uiType === 'docusaurus') {
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
                        fontSize: '10px',
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
            } else if (sourceNode.id.startsWith('Gateway') && targetNode.id.startsWith('Database')) {
                errorMessage = 'Gateway Cannot be connected to a Database';
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
                setEdges(eds => Functions.addEdge(params, eds, Nodes));
                setEdges(eds => {
                    const updatedEdges = { ...eds };
                    const newEdgeId = `${sourceNode.id}-${targetNode.id}`;
                    updatedEdges[newEdgeId].markerEnd = {
                        color: 'black',
                        type: MarkerType.ArrowClosed,
                    };
                    updatedEdges[newEdgeId].className = 'success';
                    return updatedEdges;
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
                    const updatedEdges = Functions.addEdge(params, eds, Nodes);
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
                    const updatedEdges = Functions.addEdge(params, eds, Nodes);
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
            if (sourceNode.id.startsWith('dummy') || targetNode.id.startsWith('dummy')) {
                setEdges(eds => {
                    const updatedEdges = Functions.addEdge(params, eds, Nodes);
                    const newEdgeId = `${sourceNode.id}-${targetNode.id}`;
                    updatedEdges[newEdgeId].markerEnd = {
                        color: 'black',
                        type: MarkerType.ArrowClosed,
                    };
                    updatedEdges[newEdgeId].className = 'success';
                    return updatedEdges;
                });
            }
            if (
                !(
                    targetNode.id.startsWith('UI') ||
                    (targetNode.id.startsWith('Database') && sourceNode.id.startsWith('UI')) ||
                    (targetNode.id.startsWith('Database') && sourceNode.id.startsWith('Gateway')) ||
                    (targetNode.id.startsWith('Gateway') && sourceNode.id.startsWith('Service')) ||
                    sourceNode?.data.applicationFramework === 'docusaurus'
                )
            ) {
                if (targetNode.id.startsWith('Database')) {
                    let isServiceConnected = Nodes[params.source]?.data['prodDatabaseType'];
                    if (!isServiceConnected && !targetNode.data.isConnected && !sourceNode.id.startsWith('UI')) {
                        targetNode.data.isConnected = true;
                        setEdges(eds => Functions.addEdge(params, eds, Nodes));
                        Functions.MergeData(params.source, params.target, Nodes, setNodes);
                    }
                    if (!isServiceConnected) {
                        let updatedNodes = { ...Nodes };
                        if (updatedNodes[targetNode?.id]?.style && targetNode?.data?.databasePort) {
                            updatedNodes[targetNode?.id].style.border = '1px solid black';
                        }
                        setNodes(updatedNodes);
                    }
                } else if (targetNode.id.startsWith('Gateway') || sourceNode.id.startsWith('Gateway') || sourceNode.id.startsWith('UI')) {
                    setEdges(eds => {
                        const updatedEdges = Functions.addEdge(params, eds, Nodes);
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
                    setEdges(eds => Functions.addEdge(params, eds, Nodes));
                }
            }
        },
        [edges],
    );

    const clear = () => {
        localStorage.removeItem('data');
        setProjectName('clear#canvas');
        setuserData({});
        setNodes({});
        setEdges({});
        setIsServiceDiscovery(false);
        setServiceDiscoveryCount(0);
        setUniqueApplicationNames([]);
        setAiServices([]);
        setUniquePortNumbers([]);
        setServiceInputCheck([]);
        setUiInputCheck({});
        setGatewayInputCheck([]);
        databaseId = 1;
        groupId = 1;
        dummyId = 1;
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

        const loadCredits = async () => {
        if (initialized && keycloak?.authenticated) {
            try{
                var response = await fetch(process.env.REACT_APP_CREDIT_SERVICE_URL + '/head', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
            })
            if(response.ok){
                const result= await response.json();
                if(result?.creditsAvailable){
                    setUserCredits(()=> result.creditsAvailable);
                    return result.creditsAvailable;
                }
                else return 0;
            }
            else {
                throw new Error(`Fetch request failed with status: ${response.status}`);
            }
            }
            catch(error){ 
                console.error(error)
            };
        }
    }

    const loadData = async () => {
        if (initialized && projectParentId && id) {
            try {
                var response;
                if (projectParentId === 'admin') {
                    response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/refArchs/' + id, {
                        method: 'get',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                        },
                    });
                } else {
                    response = await fetch(process.env.REACT_APP_API_BASE_URL + '/blueprints/' + projectProjectId, {
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
                        if (projectParentId === 'admin') setProjectParentId(projectParentId);
                        else setProjectParentId(result.parentId);
                        setProjectName(result.request_json?.projectName);
                        setDefaultProjectName(result.request_json?.projectName);
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

    const initData = async(data) => {
        if (data != null && !(Object.keys(data).length === 0) && data?.metadata?.nodes) {
            var fetchedCredits = await loadCredits();
            const nodes = data?.metadata?.nodes;
            if (data?.projectName) {
                setProjectName(data.projectName);
                setDefaultProjectName(data.projectName);
            }
            if (!(Object.keys(nodes).length === 0)) setShowDiv(false);
            let max_groupId = -1;
            let max_serviceId = -1;
            let max_gatewayId = -1;
            let max_uiId = -1;
            let max_databaseId = -1;
            let max_dummyId = -1;
            for (const key in nodes) {
                if (key.toLowerCase().includes('servicediscovery')) {
                    setIsServiceDiscovery(true);
                    setServiceDiscoveryCount(1);
                } else if (key.toLowerCase().includes('service')) {
                    const id = key.split('_');
                    const numberId = parseInt(id[1]);
                    max_serviceId = Math.max(numberId, max_serviceId);
                    if (!nodes[key]?.data?.serverPort) {
                        setIsEmptyServiceSubmit(true);
                        setServiceInputCheck(prev => ({
                            ...prev,
                            [key]: true,
                        }));
                    } else {
                        setUniqueApplicationNames(prev => [...prev, data.metadata.nodes[key].data.label]);
                        setUniquePortNumbers(prev => [...prev, data.metadata.nodes[key].data.serverPort]);
                        setServiceInputCheck(prev => ({
                            ...prev,
                            [key]: false,
                        }));
                        if(data.metadata.nodes[key].data?.description && data.metadata.nodes[key].data?.dbmlData && fetchedCredits>0){
                            // console.log(srviceCombinations,"combinations")
                            setAiServices(prev => [...prev,data.metadata.nodes[key].data.Id])
                            fetchedCredits--;
                        }
                    }
                } else if (key.toLowerCase().includes('gateway')) {
                    const id = key.split('_');
                    const numberId = parseInt(id[1]);
                    max_gatewayId = Math.max(numberId, max_gatewayId);
                    if (!nodes[key]?.data?.serverPort) {
                        setIsEmptyGatewaySubmit(true);
                        setGatewayInputCheck(prev => ({
                            ...prev,
                            [key]: true,
                        }));
                    } else {
                        setUniqueApplicationNames(prev => [...prev, data.metadata.nodes[key].data.label]);
                        setUniquePortNumbers(prev => [...prev, data.metadata.nodes[key].data.serverPort]);
                        setGatewayInputCheck(prev => ({
                            ...prev,
                            [key]: false,
                        }));
                    }
                    setIsGatewayNodeEnabled(true);
                } else if (key.toLowerCase().includes('database')) {
                    const id = key.split('_');
                    const numberId = parseInt(id[1]);
                    max_databaseId = Math.max(numberId, max_databaseId);
                } else if (key.toLowerCase().includes('group')) {
                    const id = key.split('_');
                    const numberId = parseInt(id[1]);
                    max_groupId = Math.max(numberId, max_groupId);
                } else if (key.toLowerCase().includes('dummy')) {
                    const id = key.split('_');
                    const numberId = parseInt(id[1]);
                    max_dummyId = Math.max(numberId, max_dummyId);
                } else if (key.toLowerCase().includes('auth')) {
                    setAuthProviderCount(1);
                } else if (key.toLowerCase().includes('messagebroker')) {
                    setIsMessageBroker(true);
                    setMessageBrokerCount(1);
                } else if (key.toLowerCase().includes('logmanagement')) {
                    setLogManagementCount(1);
                } else if (key.toLowerCase().includes('ui')) {
                    const id = key.split('_');
                    const numberId = parseInt(id[1]);
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
                    if (uiCount === 2) setIsUINodeEnabled(true);
                    if (!nodes[key]?.data?.serverPort) {
                        setIsEmptyUiSubmit(true);
                        setUiInputCheck(prev => ({
                            ...prev,
                            [key]: true,
                        }));
                    } else {
                        setUniqueApplicationNames(prev => [...prev, data.metadata.nodes[key].data.label]);
                        setUniquePortNumbers(prev => [...prev, data.metadata.nodes[key].data.serverPort]);
                        setUiInputCheck(prev => ({
                            ...prev,
                            [key]: false,
                        }));
                    }
                }
            }
            if (max_serviceId !== -1) serviceId = max_serviceId + 1;
            if (max_databaseId !== -1) databaseId = max_databaseId + 1;
            if (max_gatewayId !== -1) gatewayId = max_gatewayId + 1;
            if (max_uiId !== -1) uiId = max_uiId + 1;
            if (max_groupId !== -1) groupId = max_groupId + 1;
            if (max_dummyId !== -1) dummyId = max_dummyId + 1;
        }
    };

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
            if (Data?.databasePort) {
                setUniquePortNumbers(prev => prev.filter(port => Data.databasePort !== port));
            }
            setUniquePortNumbers(prev => [...prev, Data.serverPort]);
            if (Data?.databasePort) {
                setUniquePortNumbers(prev => [...prev, Data.databasePort]);
            }
            UpdatedNodes[Isopen].data = { ...UpdatedNodes[Isopen].data, ...Data };
            UpdatedNodes[Isopen].selected = false;
            if (Isopen.startsWith('UI') && UpdatedNodes[Isopen].data?.applicationFramework === 'ui') {
                delete UpdatedNodes[Isopen].data?.theme;
            }
            if (Isopen.startsWith('Database') && Data?.isConnected && Data?.databasePort) {
                for (let edge in edges) {
                    if (edge.endsWith(Isopen)) {
                        const nodeName = edge.split('-')[0];
                        UpdatedNodes[nodeName].data.databasePort = Data.databasePort;
                    }
                }
                UpdatedNodes[Isopen].style.border = '1px solid black';
            }
        }
        if (Data?.dbmlData && Data?.description) {
            const serviceIdExists = aiServices.includes(Data.Id);

            if (!serviceIdExists && credits>0) {
                setAiServices([...aiServices, Data.Id]);
            }
        }

        setNodes(UpdatedNodes);
        setopen(false);
    };

    const dataCheck = Data => {
        const projectName1 = Data.projectName;
        const projectName2 = initialData.projectName ? initialData.projectName : initialData.request_json?.projectName;

        if (projectName1 !== projectName2) {
            return true;
        }

        const edges1 = Object.values(Data.metadata?.edges || {});
        const edges2 = Object.values(initialData.metadata?.edges || {});

        if (edges1.length !== edges2.length) {
            return true;
        }
        for (let i = 0; i < edges1.length; i++) {
            const edge1 = edges1[i];
            const edge2 = edges2[i];
            if (
                !edge1 ||
                !edge2 ||
                !edge1.data ||
                !edge2.data ||
                edge1.data.client !== edge2.data.client ||
                edge1.data.server !== edge2.data.server ||
                edge1.data.framework !== edge2.data.framework
            ) {
                return true;
            }
        }

        const nodes1 = Object.values(Data.metadata?.nodes || {});
        const nodes2 = Object.values(initialData.metadata?.nodes || {});
        if (nodes1.length !== nodes2.length) {
            return true;
        }

        for (let i = 0; i < nodes1.length; i++) {
            const node1 = nodes1[i]?.data;
            const node2 = nodes2[i]?.data;
            if (JSON.stringify(node1) !== JSON.stringify(node2)) {
                return true;
            }
        }

        return false;
    };

    const onsubmit = (Data, submit = false) => {
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

        let Service_Discovery_Data = nodes['serviceDiscoveryType']?.data?.serviceDiscoveryType;
        let authenticationData = nodes['authenticationType']?.data?.authenticationType || 'no';
        let logManagementData = nodes['logManagement']?.data?.logManagementType;
        if (logManagementData && Data?.deployment) Data.deployment.enableECK = 'true';
        if (Data.deployment && Service_Discovery_Data)
            Data.deployment = { ...Data.deployment, serviceDiscoveryType: Service_Discovery_Data };
        for (const key in NewNodes) {
            const Node = NewNodes[key];
            delete Node.data?.color;
            if(Node.id.startsWith('Service') && !aiServices.includes(Node.id)){
                if(Node.data?.description){
                    delete Node.data.description;
                }
                if(Node.data?.dbmlData){
                    delete Node.data.dbmlData;
                }
            }
            if (Node.id.startsWith('Service') || Node.id.startsWith('UI') || Node.id.startsWith('Gateway')) {
                if (Service_Discovery_Data && (serviceRegistryEdges.length === 0 || serviceRegistryEdges.includes(Node.id))) {
                    Node.data.serviceDiscoveryType = Service_Discovery_Data;
                } else if (Node.data?.serviceDiscoveryType) {
                    delete Node.data.serviceDiscoveryType;
                }
                if (authenticationData && (authEdges.length === 0 || authEdges.includes(Node.id))) {
                    Node.data.authenticationType = authenticationData;
                } else {
                    Node.data.authenticationType = 'no';
                }
                if (logManagementData && (logManagementEdges.length === 0 || logManagementEdges.includes(Node.id))) {
                    Node.data.logManagementType = logManagementData;
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
                    delete Node?.data?.theme;
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
                const targetIsExcluded =
                    Edge.target.startsWith('Database') ||
                    Edge.target.startsWith('authenticationType') ||
                    Edge.target.startsWith('logManagement') ||
                    Edge.target.startsWith('serviceDiscoveryType') ||
                    Edge.target.startsWith('dummy') ||
                    Edge.source.startsWith('dummy') ||
                    Edge.target.startsWith('group') ||
                    Edge.source.startsWith('group');

                if (!targetIsExcluded) {
                    Edge.data = Edge.data || {};
                    Edge.data.client = nodes[Edge.source].data.applicationName;
                    Edge.data.server = nodes[Edge.target].data.applicationName;
                    if (Object.keys(Edge.data).length !== 0) {
                        Data['communications'][communicationIndex++] = Edge.data;
                        if (Edge.data.type === 'asynchronous') {
                            Data['communications'][communicationIndex - 1].server = nodes[Edge.source].data.applicationName;
                            Data['communications'][communicationIndex - 1].client = nodes[Edge.target].data.applicationName;
                        }
                    }
                }
            }
        }
        Data['metadata'] = {
            nodes: nodes,
            edges: edges,
            deployment: Data?.deployment,
        };
        if (projectProjectId) {
            Data.projectId = projectProjectId;
        }
        if (projectParentId) {
            Data.parentId = projectParentId;
        }
        setNodes(NewNodes);
        setGeneratingData(structuredClone(Data));
        Data.validationStatus = 'VALIDATED';

        if (!initialData) {
            Data.version = 1;
        } else {
            if (dataCheck(Data)) {
                Data.version = initialData.version + 1;
            } else {
                Data.version = initialData.version;
            }
        }
        setUpdated(false);
        if (Data?.save) {
            var saved = Data.save;
            delete Data?.save;
            SaveData(Data, saved);
        } else {
            SaveData(Data, 'VALIDATED');
        }
        if (submit) {
            generateZip(null, Data);
        }
    };

    const SaveData = async (data, saved) => {
        const Data = data || generatingData;
        const generatedImage = await Functions.CreateImage(Object.values(nodes));
        if (generatedImage){ 
            Data.imageUrl = generatedImage;
        }
        if (saved !== 'VALIDATED') data.validationStatus = 'DRAFT';
        setInitialData(Data);
        try {
            var response;
            if (projectParentId === 'admin') {
                response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/refArchs', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                    },
                    body: JSON.stringify(Data),
                });
            } else {
                response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/blueprints', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                    },
                    body: JSON.stringify(Data),
                });
            }
            if (response.ok) {
                if (projectParentId != 'admin' && data.validationStatus == 'VALIDATED') {
                    setIsLoading(true);
                }
                setSpinner(false);
                const responseData = await response.json();
                if (!projectProjectId) setProjectprojectId(responseData.projectId);
                if (saved == 'VALIDATED' && projectParentId == 'admin') {
                    history.replace(`/project/admin/architecture/${responseData.projectId}/details`);
                }
                if (!projectProjectId) setProjectprojectId(responseData.projectId);
                if (saved === 'save') {
                    toast.close(toastIdRef.current);
                    toastIdRef.current = toast({
                        title: `Prototype ${projectName}  is saved as draft.`,
                        status: 'success',
                        duration: 3000,
                        variant: 'left-accent',
                        isClosable: true,
                    });
                }
            } else {
                if (saved === 'save') {
                    toast.close(toastIdRef.current);
                    toastIdRef.current = toast({
                        title: `Unable to save prototype.Please try again`,
                        status: 'error',
                        duration: 3000,
                        variant: 'left-accent',
                        isClosable: true,
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    let completedBlueprints = [];
    let blueprintIds = [];

    const generateZip = async (e, data = null) => {
        const Data = data || generatingData;
        const generatedImage = await Functions.CreateImage(Object.values(nodes));
        setIsGenerating(true);
        if (generatedImage) Data.imageUrl = generatedImage;
        try {
            const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/generate', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
                body: JSON.stringify(Data),
            });

            const responseData = await response.json();
            const initialBlueprintId = responseData.blueprintId;
            blueprintIds.push(initialBlueprintId);

            await new Promise(resolve => setTimeout(resolve, 10000));
            setIsGenerating(false);
        } catch (error) {
            console.error(error);
        } finally {
            if (initialized && keycloak.authenticated) {
                clear();
                if (projectParentId === 'admin') {
                    history.replace('/architectures');
                } else {
                    history.replace('/prototypes');
                }
            } else {
                clear();
                setIsLoading(false);
                history.push('/canvasToCode');
            }
        }
    };

    const onEdgeClick = (e, edge) => {
        let updatedEdges = { ...edges };
        setEdgeopen(edge.id);
        setCurrentEdge(updatedEdges[edge.id].data);
        Object.keys(updatedEdges).forEach(existingEdgeId => {
            existingEdgeId = parseInt(existingEdgeId);

            if (existingEdgeId !== edge.id) {
                if (updatedEdges[existingEdgeId]?.selected) {
                    updatedEdges[existingEdgeId].selected = false;
                }
            }
        });
        updatedEdges[edge.id].selected = true;
        setEdges(updatedEdges);
    };

    const handleEdgeData = Data => {
        let UpdatedEdges = { ...edges };
        const [source, destination] = IsEdgeopen.split('-');
        if (!(source.startsWith('Service') && destination.startsWith('Service'))) {
            UpdatedEdges[IsEdgeopen].label = Data.label;
        } else if (Data.framework === 'rest-api') {
            UpdatedEdges[IsEdgeopen].label = 'Rest';
            if (UpdatedEdges[IsEdgeopen]?.animated) {
                delete UpdatedEdges[IsEdgeopen].animated;
            }
        } else {
            UpdatedEdges[IsEdgeopen].label = 'RabbitMQ';
        }
        UpdatedEdges[IsEdgeopen].markerEnd = {
            color: 'black',
            type: MarkerType.ArrowClosed,
        };
        UpdatedEdges[IsEdgeopen].className = 'success';
        if (Data.type === 'asynchronous') {
            delete UpdatedEdges[IsEdgeopen].markerEnd.type;
            UpdatedEdges[IsEdgeopen].animated = true;
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

    const UpdateSave = () => {
        setsaveMetadata(prev => !prev);
    };

    const handleColorClick = color => {
        let UpdatedNodes = structuredClone(nodes);
        setSelectedColor(color);
        (UpdatedNodes[nodeClick].style ??= {}).backgroundColor = color;
        setNodes({ ...UpdatedNodes });
    };

    const handleEdgeColorClick = color => {
        let UpdatedEdges = structuredClone(edges);
        setSelectedColor(color);
        (UpdatedEdges[IsEdgeopen].style ??= {}).stroke = color;
        setEdges({ ...UpdatedEdges });
    };

    const handleSave = async () => {
        if (projectName && projectName !== 'clear#canvas') {
            if (!keycloak.authenticated) {
                await keycloak.login({
                    redirectUri: process.env.REACT_APP_UI_BASE_URL + 'canvasToCode',
                });
            }
            setSpinner(true);
            saveData('save');
        } else {
            handleInvalidProjectName();
        }
    };

    const handleSubmit = () => {
        const { isValid, message } = checkDisabled(projectName, isEmptyUiSubmit, isEmptyServiceSubmit, isEmptyGatewaySubmit, nodes, edges);
        const errorMessage = message || 'Validation failed';
        toast.close(toastIdRef.current);
        toastIdRef.current = toast({
            title: errorMessage,
            status: isValid ? 'success' : 'error',
            duration: 3000,
            variant: 'left-accent',
            isClosable: true,
        });
        if (!isValid) return;
        saveData(false);
    };

    const saveData = isSave => {
        var servicesData = nodes;
        var edgesData = edges;
        let data = { metadata: {} };
        let currentIndex = 0;
        data.metadata.nodes = servicesData;
        data.metadata.edges = edgesData;
        data.projectName = projectName;
        data.services = {};
        data.communications = {};
        for (var val in nodes) {
            if (val.startsWith('UI') || val.startsWith('Service') || val.startsWith('Gateway')) {
                data.services[currentIndex] = data.metadata.nodes[val].data;
                currentIndex++;
            }
        }
        currentIndex = 0;
        for (var val in edges) {
            data.communications[currentIndex] = data.metadata.edges[val].data;
            currentIndex++;
        }

        if (isSave) {
            data.save = isSave;
        }

        onsubmit(data);
    };

    const handleInvalidProjectName = () => {
        toast.close(toastIdRef.current);
        toastIdRef.current = toast({
            title: 'Enter a valid ProjectName',
            status: 'error',
            duration: 3000,
            variant: 'left-accent',
            isClosable: true,
        });
    };

    const onclick = (e, node) => {
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

    const useOnNodeContextMenu =useCallback(
            (event, node) => {
                event.preventDefault();
                setMenu({
                    id: node.id,
                    node: node,
                    top: event.clientY - 50,
                    left: event.clientX + 10,
                });
            },
            [setMenu],
        );

    if (isLoading) {
        if (isGenerating) return <Generating generatingData={generatingData} />;
        return (
            <ReactFlowProvider>
                <ReviewFlow
                    nodesData={Object.values(nodes)}
                    edgesData={Object.values(edges)}
                    setViewOnly={setIsLoading}
                    generateZip={generateZip}
                    deploymentData={generatingData}
                    generateMode
                    onSubmit={onsubmit}
                    saveData={saveData}
                />
            </ReactFlowProvider>
        );
    }
    return (
        <div className="dndflow" style={{ overflow: 'hidden !important' }}>
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
                        onNodeDoubleClick={(e, node) =>
                            onclick(e, node)
                        }
                        onDrop={e =>
                            onDrop(e, ServiceDiscoveryCount, MessageBrokerCount, LogManagemntCount, AuthProviderCount, UICount, docsCount)
                        }
                        onDragOver={onDragOver}
                        onDragLeave={() => setShowDiv(Object.keys(nodes).length === 0)}
                        deleteKeyCode={['Backspace', 'Delete']}
                        fitView
                        // onEdgeUpdate={(oldEdge, newConnection) => onEdgeUpdate(nodes, oldEdge, newConnection)}
                        onEdgeUpdateStart={() => Functions.onEdgeUpdateStart(edgeUpdateSuccessful)}
                        onEdgeUpdateEnd={(_, edge) => Functions.onEdgeUpdateEnd(nodes, edge)}
                        onEdgeClick={!viewOnly ? onEdgeClick : ''}
                        defaultViewport={defaultViewport}
                        nodesDraggable={!viewOnly}
                        elementsSelectable={!viewOnly}
                        nodesConnectable={!viewOnly}
                        onPaneClick={onPaneClick}
                        onNodeContextMenu={useOnNodeContextMenu}
                    >
                        {menu && <ContextMenu onClick={onPaneClick} {...menu} onEditClick={!viewOnly ? onclick : () => {}} />}
                        <Flex height={'inherit'}>
                            <Sidebar
                                isUINodeEnabled={isUINodeEnabled}
                                isGatewayNodeEnabled={isGatewayNodeEnabled}
                                Service_Discovery_Data={nodes['serviceDiscoveryType']?.data}
                                authenticationData={nodes['authenticationType']?.data}
                                nodes={nodes}
                                architectureName={projectName}
                                setArchitectureName={setProjectName}
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
                                clearName={triggerExit.onOk}
                                viewOnly={viewOnly}
                                id={id}
                                clear={clear}
                                parentId={projectParentId}
                                projectNames={projectNames}
                                defaultProjectName={defaultProjectName}
                                setSpinner={setSpinner}
                                spinner={spinner}
                            />
                            <div
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: Isopen ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
                                    zIndex: 9999,
                                    display: Isopen ? 'block' : 'none',
                                }}
                            />
                            {showDiv && <CanvasContent />}
                        </Flex>
                        <Controls showInteractive={!viewOnly} />
                        <Panel position="top-right">
                            <HStack justifyContent="flex-end" alignItems="flex-start">
                                {initialized && keycloak?.authenticated && (
                                    <Box bg="gray.200" p={2} borderRadius="md" mr={4}>
                                        <Text fontSize="sm" fontWeight="bold">
                                            Credits Used: {aiServices.length}
                                        </Text>
                                    </Box>
                                )}
                                <VStack spacing={4} alignItems={'stretch'}>
                                    <Button
                                        hidden={true}
                                        colorScheme="blackAlpha"
                                        size="sm"
                                        onClick={() => console.log(nodes, edges, userData, projectParentId, projectName, generatingData)}
                                    >
                                        Print
                                    </Button>
                                    <DownloadButton applicationName={projectName} />
                                    <Tooltip
                                        label="Clear Canvas"
                                        placement="left"
                                        bg="blue.500"
                                        color="white"
                                        borderRadius="md"
                                        fontSize="sm"
                                    >
                                        <IconButton
                                            hidden={viewOnly}
                                            icon={<Icon as={FaEraser} />}
                                            size="md"
                                            onClick={() => {
                                                if (!(Object.keys(nodes).length === 0)) {
                                                    setVisibleDialog(true);
                                                    setActionModalType('clear');
                                                }
                                            }}
                                        />
                                    </Tooltip>
                                    <Tooltip
                                        label="Save Architecture"
                                        placement="left"
                                        bg="blue.500"
                                        color="white"
                                        borderRadius="md"
                                        fontSize="sm"
                                    >
                                        <IconButton
                                            hidden={viewOnly}
                                            icon={<Icon as={AiOutlineSave} />}
                                            size="md"
                                            onClick={() => {
                                                setUpdated(false);
                                                handleSave();
                                            }}
                                        />
                                    </Tooltip>
                                </VStack>
                            </HStack>
                        </Panel>
                        <Background gap={10} color="#f2f2f2" variant={BackgroundVariant.Lines} />
                    </ReactFlow>
                </div>
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

                {/* {nodeType === 'UI' && Isopen && ( */}
                {/* // <UiDataModal */}
                {nodeType === 'UI' && Isopen && (
                    <ApplicationModal
                        nodeType={nodeType}
                        isOpen={Isopen}
                        CurrentNode={CurrentNode}
                        onClose={setopen}
                        onSubmit={onChange}
                        handleColorClick={handleColorClick}
                        uniqueApplicationNames={uniqueApplicationNames}
                        uniquePortNumbers={uniquePortNumbers}
                    />
                )}
                {nodeType === 'Service' && Isopen && (
                    <ApplicationModal
                        nodeType={nodeType}
                        isOpen={Isopen}
                        CurrentNode={CurrentNode}
                        onClose={setopen}
                        onSubmit={onChange}
                        handleColorClick={handleColorClick}
                        uniqueApplicationNames={uniqueApplicationNames}
                        uniquePortNumbers={uniquePortNumbers}
                        credits={credits}
                        aiServices={aiServices.includes(Isopen)}
                    />
                )}
                {nodeType === 'Gateway' && Isopen && (
                    <ApplicationModal
                        nodeType={nodeType}
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
                    <ApplicationModal
                        nodeType={'Group'}
                        isOpen={Isopen}
                        CurrentNode={CurrentNode}
                        onClose={setopen}
                        onSubmit={onChange}
                        handleColorClick={handleColorClick}
                    />
                )}
                {nodeType === 'dummy' && Isopen && (
                    <ApplicationModal
                        nodeType={'Dummy'}
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
                        uniquePortNumbers={uniquePortNumbers}
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
                {IsEdgeopen && (
                    <EdgeModal
                        isOpen={IsEdgeopen}
                        CurrentEdge={CurrentEdge}
                        nodes={nodes}
                        onClose={setEdgeopen}
                        handleEdgeData={handleEdgeData}
                        isMessageBroker={isMessageBroker}
                        handleColorClick={handleEdgeColorClick}
                    />
                )}

                {ServiceDiscoveryCount === 2 && <AlertModal isOpen={true} onClose={() => setServiceDiscoveryCount(1)} />}
                {MessageBrokerCount === 2 && <AlertModal isOpen={true} onClose={() => setMessageBrokerCount(1)} />}
                {CloudProviderCount === 2 && <AlertModal isOpen={true} onClose={() => setCloudProviderCount(1)} />}
                {LogManagemntCount === 2 && <AlertModal isOpen={true} onClose={() => setLogManagementCount(1)} />}
                {AuthProviderCount === 2 && <AlertModal isOpen={true} onClose={() => setAuthProviderCount(1)} />}
                {UICount === 2 && <AlertModal isOpen={true} onClose={() => setUiCount(1)} />}
                {docsCount === 2 && <AlertModal isOpen={true} onClose={() => setDocsCount(1)} />}
                {spinner && (
                    <Flex
                        position="fixed"
                        top="62"
                        left="0"
                        right="0"
                        bottom="0"
                        backgroundColor={''}
                        alignItems="center"
                        justifyContent="center"
                        zIndex="9999"
                        display="flex"
                        flexDirection="column"
                    >
                        <Spinner thickness="2px" speed="0.4s" emptyColor="gray.200" color="#3182CE" height="150px" width="150px" />
                    </Flex>
                )}
            </ReactFlowProvider>
        </div>
    );
};

export default Designer;
