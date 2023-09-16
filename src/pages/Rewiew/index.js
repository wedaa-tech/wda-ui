import React, { useCallback, useEffect, useState } from 'react';
import { Grid, Button, GridItem } from '@chakra-ui/react';
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

export const ReviewFlow = ({ nodesData, edgesData, setViewOnly = false }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(useExample ? example.nodes : nodesData);
    const [edges, setEdges, onEdgesChange] = useEdgesState(useExample ? example.edges : edgesData);

    const history = useHistory();

    const { parentId, id } = useParams();

    useEffect(() => {
        setNodes(nodesData);
        setEdges(edgesData);
        console.log(nodesData, edgesData);
    }, [nodes, edges, nodesData, edgesData, setNodes, setEdges]);

    const [nodeId, setNodeId] = useState(null);

    const { setCenter } = useReactFlow();

    const focusNode = useCallback(
        (_, selectedNode) => {
            console.log('selectedNode', selectedNode);

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
        history.goBack();
    };

    return (
        <Grid templateColumns="repeat(7, 1fr)" height={'calc(100vh - 64px)'} maxH={'calc(100vh - 64px)'}>
            <GridItem colSpan={4}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={focusNode}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Panel position="top-right">
                        <Button backgroundColor={'skyblue'} color={'white'} onClick={handleEditClick}>
                            Edit Mode
                        </Button>
                    </Panel>
                    <Panel position="top-left">
                        <Button hidden={setViewOnly ? true : false} backgroundColor={'skyblue'} color={'white'} onClick={handleBackClick}>
                            Back
                        </Button>
                    </Panel>
                    <Controls position="bottom-right" />
                    <Background color="#ccc" variant={BackgroundVariant.Lines} />
                </ReactFlow>
            </GridItem>
            <GridItem
                colSpan={3}
                backgroundColor={'white.100'}
                boxShadow={'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;'}
            >
                <CodeReview nodeId={nodeId} />
            </GridItem>
        </Grid>
    );
};

const Review = () => {
    const { initialized, keycloak } = useKeycloak();
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    const { parentId, id } = useParams();

    useEffect(() => {
        if (initialized) {
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
                        setNodes(Object.values(result.metadata?.nodes));
                        setEdges(Object.values(result.metadata?.edges));
                    }
                })
                .catch(error => console.error(error));
        }
    }, [id, initialized, keycloak, parentId]);

    useEffect(() => {}, []);

    return (
        <ReactFlowProvider>
            <ReviewFlow nodesData={nodes} edgesData={edges} />
        </ReactFlowProvider>
    );
};

export default Review;
