import React, { useCallback, useEffect, useState } from 'react';
import { Grid, Button, GridItem, Flex } from '@chakra-ui/react';
import './index.css';
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
    deployementData = null,
    onSubmit = null,
    published = false,
}) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(useExample ? example.nodes : nodesData);
    const [edges, setEdges, onEdgesChange] = useEdgesState(useExample ? example.edges : edgesData);

    const history = useHistory();

    const { parentId, id } = useParams();

    useEffect(() => {
        setNodes(nodesData);
        setEdges(edgesData);
    }, [nodes, edges, nodesData, edgesData, setNodes, setEdges]);

    const [nodeId, setNodeId] = useState(null);

    const { setCenter } = useReactFlow();

    const focusNode = useCallback(
        (_, selectedNode) => {
            setNodeId(selectedNode.id);

            const x = selectedNode.position.x + selectedNode.width / 2;
            const y = selectedNode.position.y + selectedNode.height / 2;
            const zoom = 1.85;

            setCenter(x, y, { zoom, duration: 1000 });
        },
        [setCenter],
    );

    const handleEditClick = () => {
        if (!setViewOnly) {
            history.replace('/project/' + parentId + '/architecture/' + id + '/edit');
        } else {
            setViewOnly(false);
        }
    };

    const handleBackClick = () => {
        if (parentId === 'Admin') history.replace('/architectures');
        else history.replace('/project/' + parentId + '/architectures');
    };

    return (
        <Grid templateColumns="repeat(7, 1fr)" height={'calc(100vh - 64px)'} maxH={'calc(100vh - 64px)'}>
            <GridItem colSpan={4}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    snapGrid={[10, 10]}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={focusNode}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    nodeTypes={nodeTypes}
                    // showInteractive={false}
                    fitView
                >
                    <Panel position="top-right">
                        <Button colorScheme="blue" onClick={generateMode ? () => setViewOnly(false) : handleEditClick}>
                            {generateMode ? 'Go Back' : 'Edit Mode'}
                        </Button>
                        <Button hidden={true} colorScheme="blue" onClick={() => console.log(deployementData)}>
                            Print
                        </Button>
                    </Panel>
                    <Panel position="top-left">
                        <Button hidden={setViewOnly ? true : false} colorScheme="blue" onClick={handleBackClick}>
                            Back
                        </Button>
                    </Panel>
                    <Controls position="bottom-right" showInteractive={false} />
                    <Background gap={10} color="#f2f2f2" variant={BackgroundVariant.Lines} />
                </ReactFlow>
            </GridItem>
            <GridItem
                colSpan={3}
                backgroundColor={'white.100'}
                boxShadow={'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;'}
                height={'inherit'}
            >
                <CodeReview
                    nodeId={nodeId}
                    generateMode={generateMode}
                    deployementData={deployementData}
                    onSubmit={onSubmit}
                    published={published}
                    onClick={generateZip}
                    parentId={parentId}
                />
            </GridItem>
        </Grid>
    );
};

const Review = () => {
    const { initialized, keycloak } = useKeycloak();
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [deployementData, setDeployementData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [published, setPublished] = useState(false);
    const { parentId, id } = useParams();

    useEffect(() => {
        if (initialized) {
            if (parentId === 'Admin') {
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
                            setNodes(Object.values(result.metadata?.nodes || []));
                            setEdges(Object.values(result.metadata?.edges || []));
                            var result_json = { ...structuredClone(result.request_json), _id: result._id };
                            setDeployementData(result_json);
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
                            setNodes(Object.values(result.metadata?.nodes || []));
                            setEdges(Object.values(result.metadata?.edges || []));
                            setDeployementData(structuredClone(result.request_json));
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

    return (
        <ReactFlowProvider>
            <ReviewFlow nodesData={nodes} edgesData={edges} deployementData={deployementData} published={published} />
        </ReactFlowProvider>
    );
};

export default Review;
