import React, { useCallback, useEffect, useState } from 'react';
import { Grid, Button, GridItem, Flex, IconButton, useColorModeValue, Box, Tooltip, Spinner, VStack } from '@chakra-ui/react';
import './Review.css';
import ReactFlow, {
    Background,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    BackgroundVariant,
    Controls,
    useReactFlow,
    Panel,
} from 'reactflow';
import { example } from './Example';
import CustomImageNode from '../Customnodes/CustomImageNode';
import CustomServiceNode from '../Customnodes/CustomServiceNode';
import CustomIngressNode from '../Customnodes/CustomIngressNode';
import CustomAuthNode from '../Customnodes/CustomAuthNode';
import CustomMessageBrokerNode from '../Customnodes/CustomMessageBrokerNode';
import CustomCloudNode from '../Customnodes/CustomCloudNode';
import CustomLoadNode from '../Customnodes/CustomLoadNode';
import CustomLocalenvironmentNode from '../Customnodes/CustomLocalenvironmentNode';
import ResizableNode from '../Customnodes/ResizeableNode';
import GroupNode from '../Customnodes/GroupNode';
import CodeReview from './CodeReview';
import { useKeycloak } from '@react-keycloak/web';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import keycloak from '../../Keycloak';
import { CloseIcon, HamburgerIcon, EditIcon } from '@chakra-ui/icons';
import { FaCode } from 'react-icons/fa6';
import { saveAs } from 'file-saver';
import Generating from '../../components/Generating';

const useExample = false;

const nodeTypes = {
    selectorNode: CustomImageNode,
    selectorNode1: CustomServiceNode,
    selectorNode2: CustomIngressNode,
    selectorNode3: CustomAuthNode,
    selectorNode4: CustomMessageBrokerNode,
    selectorNode5: CustomCloudNode,
    selectorNode6: CustomLoadNode,
    selectorNode7: CustomLocalenvironmentNode,
    ResizableNode: ResizableNode,
    GroupNode: GroupNode,
};

const voidfunc = () => {};

const panelStyle = {
    color: '#777',
    fontSize: 12,
};

const buttonStyle = {
    fontSize: 12,
    marginRight: 5,
    marginTop: 5,
};

export const ReviewFlow = ({
    nodesData,
    edgesData,
    setViewOnly = false,
    generateZip = voidfunc,
    generateMode = false,
    deploymentData = null,
    onSubmit = null,
    published = false,
    saveData,
    reviewData = null,
    setIsGenerating = null,
}) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(useExample ? example.nodes : nodesData);
    const [edges, setEdges, onEdgesChange] = useEdgesState(useExample ? example.edges : edgesData);

    const history = useHistory();
    const { initialized, keycloak } = useKeycloak();

    const { parentId, id } = useParams();
    const [sideBarOpen, setSideBarOpen] = useState(true);

    useEffect(() => {
        setNodes(nodesData);
        setEdges(edgesData);
    }, [nodes, edges, nodesData, edgesData, setNodes, setEdges]);

    const [nodeId, setNodeId] = useState(null);
    const [edgeId, setEdgeId] = useState(null);

    const { setCenter } = useReactFlow();

    const focusEdge = useCallback(
        (_, selectedEdge) => {
            const edgeData = selectedEdge.data;
            var newEdgeId
            if(selectedEdge.data.type=="synchronous"){
                newEdgeId = `${edgeData.client}-${edgeData.server}`;
              }else{
                 newEdgeId = `${edgeData.server}-${edgeData.client}`;
              }
            setEdgeId(newEdgeId);
            setNodeId(null);
        }
    );

    const focusNode = useCallback(
        (_, selectedNode) => {
            setNodeId(selectedNode.id);
            setEdgeId(null);
            const x = selectedNode.position.x + selectedNode.width / 2;
            const y = selectedNode.position.y + selectedNode.height / 2;
            const zoom = 1.85;

            setCenter(x, y, { zoom, duration: 1000 });
        },
        [setCenter],
    );

    const handleEditClick = async () => {
        if (!setViewOnly) {
            try {
                reviewData.validationStatus = 'DRAFT';
                var response;
                if (reviewData?.request_json?.projectName) reviewData.projectName = reviewData?.request_json?.projectName;
                if (reviewData?.id) reviewData.projectId = reviewData?.id;
                if (reviewData?.project_id) reviewData.projectId = reviewData.project_id;
                if (parentId === 'admin') {
                    response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/refArchs', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                        },
                        body: JSON.stringify(reviewData),
                    });
                } else {
                    response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/blueprints', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                        },
                        body: JSON.stringify(reviewData),
                    });
                }
            } catch (error) {
                console.error(error);
            }
            history.replace('/project/' + parentId + '/architecture/' + id + '/edit');
        } else {
            saveData('draft');
            setViewOnly(false);
        }
    };

    const handlesubmit = async () => {
        setIsGenerating(true);
        if (reviewData?.request_json?.projectName) reviewData.projectName = reviewData?.request_json?.projectName;
        if (reviewData?.id) reviewData.projectId = reviewData?.id;
        if (reviewData?.project_id) reviewData.projectId = reviewData.project_id;
        if (reviewData?.request_json?.communications) reviewData.communications = reviewData?.request_json?.communications;
        if (reviewData?.request_json?.services) reviewData.services = reviewData?.request_json?.services;

        var blueprintId;
        try {
            const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/generate', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
                body: JSON.stringify(reviewData),
            });
            blueprintId = response.headers.get('blueprintid');
            const blob = await response.blob();
            setIsGenerating(false);
            saveAs(blob, `${reviewData.projectName}.zip`);
        } catch (error) {
            console.error(error);
        } finally {
            if (initialized && keycloak.authenticated) {
                if (parentId === 'admin') {
                    history.replace('/prototypes');
                } else {
                    history.replace('/architectures');
                }
            } else {
                history.push('/canvasToCode');
            }
        }
    };

    const handleBackClick = async () => {
        try {
            reviewData.validationStatus = 'DRAFT';
            var response;
            if (parentId === 'admin') {
                response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/refArchs', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                    },
                    body: JSON.stringify(reviewData),
                });
            } else {
                response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/blueprints', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                    },
                    body: JSON.stringify(reviewData),
                });
            }
        } catch (error) {
            console.error(error);
        }
        if (parentId === 'admin') history.replace('/architectures');
        else history.replace('/prototypes');
    };

    const setViewMode = () => {
        saveData('draft');
        setViewOnly(false);
    };

    const handleToggleContent = () => {
        setSideBarOpen(!sideBarOpen);
    };

    return (
        <Grid height={'calc(100vh - 72px)'}>
            <GridItem width={sideBarOpen ? 'calc(100% - 700px);' : '100%'} transition="width 0.3s">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    snapGrid={[10, 10]}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={focusNode}
                    onEdgeClick={focusEdge}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    nodeTypes={nodeTypes}
                    // showInteractive={false}
                    fitView
                >
                    <Panel position="top-left" style={{ display: 'flex', flexDirection: 'column' }}>
                        <Tooltip label="Back to Canvas" placement="left" bg="blue.500" color="white" borderRadius="md" fontSize="sm">
                            <IconButton
                                onClick={handleEditClick}
                                colorScheme="blue"
                                position="absolute"
                                top="0px"
                                zIndex={999}
                                icon={<EditIcon />}
                            />
                        </Tooltip>
                        {!generateMode && (
                            <Tooltip label="Generate code" placement="left" bg="blue.500" color="white" borderRadius="md" fontSize="sm">
                                <IconButton
                                    onClick={handlesubmit}
                                    colorScheme="blue"
                                    position="absolute"
                                    top="60px"
                                    zIndex={999}
                                    icon={<FaCode />}
                                />
                            </Tooltip>
                        )}
                        <Button hidden={true} colorScheme="blue" onClick={() => console.log(deploymentData)}>
                            Print
                        </Button>
                    </Panel>

                    <Controls position="bottom-right" showInteractive={false} />
                    <Background gap={10} color="#f2f2f2" variant={BackgroundVariant.Lines} />
                </ReactFlow>
            </GridItem>
            <GridItem
                backgroundColor={'white'}
                boxShadow={'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;'}
                height={'inherit'}
                position={'fixed'}
                width={'700px'}
                right={0}
                style={{
                    transition: 'transform 0.3s',
                    transform: sideBarOpen ? 'translateX(0px)' : 'translateX(700px)',
                }}
            >
                <Box position="relative">
                    <IconButton
                        onClick={handleToggleContent}
                        colorScheme="blue"
                        position="absolute"
                        top="15px"
                        left="-64px"
                        zIndex={999}
                        icon={sideBarOpen ? <CloseIcon /> : <HamburgerIcon />}
                        mb={2}
                        marginRight={4}
                    />
                    {/* {!generateMode && (
                        <IconButton
                            onClick={handleEditClick}
                            colorScheme="blue"
                            position="absolute"
                            top="50px"
                            left="-64px"
                            zIndex={999}
                            icon={<EditIcon />}
                            marginTop={4}
                        />
                    )} */}
                </Box>
                <CodeReview
                    nodeId={nodeId}
                    edgeId={edgeId}
                    generateMode={generateMode}
                    deploymentData={deploymentData}
                    onSubmit={onSubmit}
                    published={published}
                    onClick={generateZip}
                    parentId={parentId}
                    setIsGenerating={setIsGenerating}
                />
            </GridItem>
        </Grid>
    );
};

const Review = () => {
    const { initialized, keycloak } = useKeycloak();
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [deploymentData, setdeploymentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [published, setPublished] = useState(false);
    const { parentId, id } = useParams();
    const [reviewData, setReviewData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    useEffect(() => {
        if (initialized) {
            if (parentId === 'admin') {
                fetch(process.env.REACT_APP_API_BASE_URL + '/api/refArchs/' + id, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                    },
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result?.metadata) {
                            setReviewData(result);
                            setNodes(Object.values(result.metadata?.nodes || []));
                            setEdges(Object.values(result.metadata?.edges || []));
                            setdeploymentData(structuredClone(result.request_json));
                            setPublished(result.published);
                        }
                    })
                    .then(() => {
                        setIsLoading(false);
                    })
                    .catch(error => console.error(error));
            } else {
                fetch(process.env.REACT_APP_API_BASE_URL + '/blueprints/' + id, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                    },
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result?.metadata) {
                            setReviewData(result);
                            setNodes(Object.values(result.metadata?.nodes || []));
                            setEdges(Object.values(result.metadata?.edges || []));
                            setdeploymentData(structuredClone(result.request_json));
                        }
                    })
                    .then(() => {
                        setIsLoading(false);
                    })
                    .catch(error => console.error(error));
            }
        }
    }, [id, initialized, keycloak, parentId]);

    if (isLoading) return <></>;
    if (isGenerating) return <Generating generatingData={deploymentData} />;

    return (
        <ReactFlowProvider>
            <ReviewFlow
                nodesData={nodes}
                edgesData={edges}
                deploymentData={deploymentData}
                published={published}
                reviewData={reviewData}
                setIsGenerating={setIsGenerating}
            />
        </ReactFlowProvider>
    );
};

export default Review;
