import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  MarkerType,
  MiniMap,
  ConnectionLineType,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import Sidebar from "./../components/Sidebar";
import { saveAs } from "file-saver";
import ServiceModal from "../components/Modal/ServiceModal";
import UiDataModal from "../components/Modal/UIModal";
import GroupDataModal from "../components/Modal/GroupDataModel";
import CustomImageNode from "./Customnodes/CustomImageNode";
import CustomServiceNode from "./Customnodes/CustomServiceNode";
import CustomIngressNode from "./Customnodes/CustomIngressNode";
import CustomAuthNode from "./Customnodes/CustomAuthNode";
import CustomMessageBrokerNode from "./Customnodes/CustomMessageBrokerNode";
import CustomCloudNode from "./Customnodes/CustomCloudNode";
import CustomLoadNode from "./Customnodes/CustomLoadNode";
import CustomLocalenvironmentNode from "./Customnodes/CustomLocalenvironmentNode";
import AlertModal from "../components/Modal/AlertModal";
import resizeableNode from "./Customnodes/ResizeableNode";
import groupNode from "./Customnodes/GroupNode";

import "./../App.css";
import EdgeModal from "../components/Modal/EdgeModal";
import { useKeycloak } from "@react-keycloak/web";
import { FiUploadCloud } from "react-icons/fi";

let service_id = 1;
let database_id = 1;
let group_id = 1;

const getId = (type = "") => {
  if (type === "Service") return `Service_${service_id++}`;
  else if (type === "Database") return `Database_${database_id++}`;
  else if (type === "Authentication") return "Authentication_1";
  else if (type === "UI+Gateway") return "UI";
  else if (type === "Group") return `group_${group_id++}`;
  return "Id";
};

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

const Designer = () => {
  const reactFlowWrapper = useRef(null);
  const { keycloak, initialized } = useKeycloak();
  const [nodes, setNodes] = useState({});
  const [nodeType, setNodeType] = useState(null);
  const [ServiceDiscoveryCount, setServiceDiscoveryCount] = useState(0);
  const [MessageBrokerCount, setMessageBrokerCount] = useState(0);
  const [CloudProviderCount, setCloudProviderCount] = useState(0);
  const [LocalenvironmentCount, setLocalenvironmentCount] = useState(0);
  const [LogManagemntCount, setLogManagementCount] = useState(0);
  const [AuthProviderCount, setAuthProviderCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmptyUiSubmit, setIsEmptyUiSubmit] = useState(false);
  const [isEmptyServiceSubmit, setIsEmptyServiceSubmit] = useState(false);

  const [serviceInputCheck, setServiceInputCheck] = useState({});

  console.log("Nodes", nodes);
  const addEdge = (edgeParams, edges) => {
    console.log(edgeParams, "edgeee");
    const edgeId = `${edgeParams.source}-${edgeParams.target}`;
    return { ...edges, [edgeId]: { id: edgeId, ...edgeParams } };
  };

  const updateEdge = (oldEdge, newConnection, edges, Nodes) => {
    console.log("OldEdge", oldEdge);
    console.log("New Connection", newConnection);
    console.log("Edges", edges);
    let newEdgeId = newConnection.source + "-" + newConnection.target;
    newConnection.markerEnd = { type: MarkerType.ArrowClosed };
    newConnection.type = "straight";
    newConnection.data = {};
    let updatedEdges = {
      ...edges,
      [newEdgeId]: { id: newEdgeId, ...newConnection },
    };
    if (oldEdge.id !== newEdgeId) delete updatedEdges[oldEdge.id];
    const oldSourceNode = Nodes[oldEdge.source];
    delete oldSourceNode?.data?.prodDatabaseType;
    setNodes((prev) => ({ ...prev, [oldSourceNode.id]: oldSourceNode }));
    return updatedEdges;
  };

  const onNodesChange = useCallback((setShowDiv, edges, changes = []) => {
    setNodes((oldNodes) => {
      const updatedNodes = { ...oldNodes };
      const updatedEdges = { ...edges };
      const deletedApplicationNames = []; // Track deleted application names

      changes.forEach((change) => {
        switch (change.type) {
          case "dimensions":
            if (change.resizing)
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
            break;
          case "position":
            updatedNodes[change.id] = {
              ...updatedNodes[change.id],
              position: {
                ...updatedNodes[change.id].position,
                ...change.position,
              },
              positionAbsolute: {
                x: 0,
                y: 0,
                ...updatedNodes[change.id].positionAbsolute,
                ...change.positionAbsolute,
              },
              dragging: change.dragging,
            };
            break;
          case "select":
            updatedNodes[change.id] = {
              ...updatedNodes[change.id],
              selected: change.selected,
            };
            break;
          case "remove": // Delete Functionality
            if (change.id === "messageBroker") {
              setIsMessageBroker(false);
              onCheckEdge(edges);
              setMessageBrokerCount(0);
            } else if (change.id === "UI") {
              setIsUINodeEnabled(false);
              setIsEmptyUiSubmit(false);
            } else if (change.id.startsWith("Service")) {
              setIsEmptyServiceSubmit(false);
            } else if (change.id === "serviceDiscoveryType") {
              setIsServiceDiscovery(false);
              setServiceDiscoveryCount(0);
              setIsServiceDiscovery(false);
              for (let key in updatedEdges) {
                let Edge = updatedEdges[key];
                if (Edge?.data?.framework === "rest-api") {
                  delete Edge?.data?.type;
                  delete Edge?.data?.framework;
                  delete Edge?.label;
                }
                setEdges(updatedEdges);
              }
            } else if (change.id === "cloudProvider") {
              setCloudProviderCount(0);
            } else if (change.id === "authenticationType") {
              setAuthProviderCount(0);
            } else if (change.id === "Localenvironment") {
              setLocalenvironmentCount(0);
            } else if (change.id === "logManagement") {
              setLogManagementCount(0);
            }
            console.log(change, "Chanfe");
            // Remove the deleted node from updatedNodes
            delete updatedNodes[change.id];
            // Remove the applicationName from uniqueApplicationNames
            const deletedNode = oldNodes[change.id];
            if (
              deletedNode &&
              deletedNode.data &&
              deletedNode.data.applicationName
            ) {
              deletedApplicationNames.push(
                deletedNode.data.applicationName.trim()
              );
            }
            break;
        }
      });
      if (Object.keys(updatedNodes).length === 0) setShowDiv(true);
      // Remove deleted application names from uniqueApplicationNames
      setUniqueApplicationNames((prev) =>
        prev.filter((appName) => !deletedApplicationNames.includes(appName))
      );

      return updatedNodes;
    });
  }, []);

  const [edges, setEdges] = useState({});
  console.log("Edges", edges);

  const onEdgesChange = useCallback((Nodes, changes = []) => {
    setEdges((oldEdges) => {
      const updatedEdges = { ...oldEdges };
      console.log(changes, updatedEdges);
      let UpdatedNodes = { ...Nodes };
      changes.forEach((change) => {
        switch (change.type) {
          case "add":
            console.log("Addddddddddd");
            // Handle add event
            break;
          case "remove":
            let [sourceId, targetId] = change.id.split("-");
            if (targetId.startsWith("Database")) {
              UpdatedNodes[targetId].data.isConnected = false;
              if (sourceId.startsWith("Service") || sourceId.startsWith("UI"))
                delete UpdatedNodes[sourceId].data.prodDatabaseType;
              setNodes(UpdatedNodes);
            }
            delete updatedEdges[change.id];
            // Handle remove event
            break;
          case "update":
            console.log("Updateeeeeeeeeeeeee");
            // Handle update event
            break;
          case "select":
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
  const [isUINodeEnabled, setIsUINodeEnabled] = useState(false);
  const [isMessageBroker, setIsMessageBroker] = useState(false);
  const [isServiceDiscovery, setIsServiceDiscovery] = useState(false);
  const [saveMetadata, setsaveMetadata] = useState(false);

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((Nodes, oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    console.log(oldEdge, newConnection, Nodes);
    if (
      !(
        newConnection.target.startsWith("Database") &&
        Nodes[newConnection.source]?.data["prodDatabaseType"]
      )
    ) {
      // Validation of service Node to check if it has database or not
      setEdges((els) => updateEdge(oldEdge, newConnection, els, Nodes));
      MergeData(newConnection.source, newConnection.target, Nodes);
    }
  }, []);

  const onEdgeUpdateEnd = useCallback((Nodes, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((edges) => {
        let AllEdges = { ...edges };
        if (edge.target.startsWith("Database")) {
          // If the edge is removed between Service and Database
          let UpdatedNodes = { ...Nodes };
          delete UpdatedNodes[edge.source].data.prodDatabaseType;
          UpdatedNodes[edge.target].data.isConnected = false;
          setNodes(UpdatedNodes);
        }
        delete AllEdges[edge.id];
        return AllEdges;
      });
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onclick = (e, node) => {
    const Id = e.target.dataset.id || e.target.name || node.id;
    console.log(Id);
    if (Id) {
      const type = Id.split("_")[0];
      setNodeType(type);
      if (type === "aws" || type === "azure") {
        setCurrentNode(nodes["cloudProvider"].data);
      } else setCurrentNode(nodes[Id].data);
      setopen(Id);
    }
  };

  const onSingleClick = (e, node) => {
    const Id = e.target.dataset.id || e.target.name || node.id;
    console.log(Id);
    setNodeClick(Id);
  };

  const onDrop = useCallback(
    (
      event,
      servicecount,
      messagecount,
      loadcount,
      authcount,
      Localenvcount
    ) => {
      setShowDiv(false);
      event.preventDefault();
      console.log(event);
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      const name = event.dataTransfer.getData("Name");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      if (name === "Service") {
        const newNode = {
          id: getId("Service"),
          type: "ResizableNode",
          position,
          data: { label: "Service" },
          style: {
            border: "1px solid",
            width: "120px",
            height: "40px",
            borderRadius: "15px",
          },
        };
        setNodes((nds) => ({ ...nds, [newNode.id]: newNode }));
        setIsEmptyServiceSubmit(true);
        setServiceInputCheck((prev) => ({
          ...prev,
          [newNode.id]: true,
        }));
      } else if (name.startsWith("Database")) {
        const prodDatabaseType = name.split("_").splice(1)[0];
        console.log(prodDatabaseType);
        const newNode = {
          id: getId("Database"),
          type: "selectorNode",
          position,
          data: { prodDatabaseType: prodDatabaseType, isConnected: false },
          style: { border: "1px solid", padding: "4px 4px" },
        };
        setNodes((nds) => ({ ...nds, [newNode.id]: newNode }));
      } else if (name.startsWith("Discovery") && servicecount === 0) {
        console.log(servicecount);
        const serviceDiscoveryType = name.split("_").splice(1)[0];
        console.log(serviceDiscoveryType);
        const newNode = {
          id: "serviceDiscoveryType",
          type: "selectorNode1",
          position,
          data: { serviceDiscoveryType: serviceDiscoveryType },
          style: { border: "1px solid", padding: "4px 4px" },
        };
        setNodes((nds) => ({ ...nds, [newNode.id]: newNode }));
        setIsServiceDiscovery(true);
        setServiceDiscoveryCount(1);
      } else if (name.startsWith("Discovery") && servicecount >= 1) {
        console.log("else", servicecount);
        setServiceDiscoveryCount(2);
      } else if (name.startsWith("Auth") && authcount === 0) {
        const authenticationType = name.split("_").splice(1)[0];
        console.log(authenticationType);
        const newNode = {
          id: "authenticationType",
          type: "selectorNode3",
          position,
          data: { authenticationType: authenticationType },
          style: { border: "1px solid", padding: "4px 4px" },
        };
        setNodes((nds) => ({ ...nds, [newNode.id]: newNode }));
        setAuthProviderCount(1);
      } else if (name.startsWith("Auth") && authcount >= 1) {
        console.log("else", authcount);
        setAuthProviderCount(2);
      } else if (name.startsWith("MessageBroker") && messagecount === 0) {
        console.log(messagecount);
        const messageBroker = name.split("_").splice(1)[0];
        console.log(messageBroker);
        const newNode = {
          id: "messageBroker",
          type: "selectorNode4",
          position,
          data: { messageBroker: messageBroker },
          style: { border: "1px solid", padding: "4px 4px" },
        };
        setNodes((nds) => ({ ...nds, [newNode.id]: newNode }));
        setIsMessageBroker(true);
        setMessageBrokerCount(1);
      } else if (name.startsWith("Group")) {
        const newNode = {
          id: getId(name),
          type: "GroupNode",
          position,
          data: { label: name },
          style: {
            border: "1px dashed",
            borderRadius: "15px",
            width: "120px",
            height: "40px",
            zIndex: -1,
          },
        };
        setNodes((nds) => ({ ...nds, [newNode.id]: newNode }));
      } else if (name.startsWith("MessageBroker") && messagecount >= 1) {
        console.log("else", messagecount);
        setMessageBrokerCount(2);
      } else if (name.startsWith("Load") && loadcount === 0) {
        const logManagementType = name.split("_").splice(1)[0];
        const newNode = {
          id: "logManagement",
          type: "selectorNode6",
          position,
          data: { logManagementType: logManagementType },
          style: { border: "1px solid", padding: "4px 4px" },
        };
        setNodes((nds) => ({ ...nds, [newNode.id]: newNode }));
        setLogManagementCount(1);
      } else if (name.startsWith("Load") && loadcount >= 1) {
        console.log("else", loadcount);
        setLogManagementCount(2);
      } else if (name.startsWith("Localenvironment") && Localenvcount === 0) {
        console.log(Localenvcount);
        const Localenvironment = name.split("_").splice(1)[0];
        console.log(Localenvironment);
        const newNode = {
          id: "Localenvironment",
          type: "selectorNode7",
          position,
          data: { Localenvironment: Localenvironment },
          style: { border: "1px solid", padding: "4px 4px" },
        };
        setNodes((nds) => ({ ...nds, [newNode.id]: newNode }));
        setLocalenvironmentCount(1);
      } else if (name.startsWith("Localenvironment") && Localenvcount >= 1) {
        console.log("else", Localenvcount);
        setLocalenvironmentCount(2);
      } else {
        const newNode = {
          id: getId("UI+Gateway"),
          type: "ResizableNode",
          position,
          data: { label: "UI+Gateway" },
          style: {
            border: "1px solid #8c8d8f",
            width: "120px",
            height: "40px",
            borderRadius: "15px",
          },
        };
        setNodes((nds) => ({ ...nds, [newNode.id]: newNode }));
        setIsUINodeEnabled(true);
        setIsEmptyUiSubmit(true);
      }
    },
    [reactFlowInstance]
  );

  const onChange = (Data) => {
    if (Data.applicationType === "gateway") {
      setIsEmptyUiSubmit("false");
    } else {
      let flag = false;
      for (let key in serviceInputCheck) {
        if (key != Isopen && serviceInputCheck[key] === true) {
          flag = true;
          setIsEmptyServiceSubmit(true);
        }
      }
      if (!flag) {
        setIsEmptyServiceSubmit(false);
      }
      setServiceInputCheck((prev) => ({
        ...prev,
        [Isopen]: false,
      }));
    }
    let UpdatedNodes = { ...nodes };
    if (Data.applicationName) {
      Data.applicationName = Data.applicationName.trim();
      Data.label = Data.label.trim();
    }
    if (Isopen === "aws" || Isopen === "azure") {
      UpdatedNodes["cloudProvider"].data = {
        ...UpdatedNodes["cloudProvider"].data,
        ...Data,
      };
      if (
        UpdatedNodes["cloudProvider"].data.kubernetesUseDynamicStorage ===
        "false"
      )
        delete UpdatedNodes["cloudProvider"].data.kubernetesStorageClassName;
    } else if (Data?.type === "Group") {
      UpdatedNodes[Isopen].data = { ...UpdatedNodes[Isopen].data, ...Data };
    } else {
      setUniqueApplicationNames((prev) => [...prev, Data.applicationName]);
      UpdatedNodes[Isopen].style.backgroundColor = Data.color;
      UpdatedNodes[Isopen].data = { ...UpdatedNodes[Isopen].data, ...Data };
      UpdatedNodes[Isopen].selected = false;
    }
    setNodes(UpdatedNodes);
    setopen(false);
  };

  const [showDiv, setShowDiv] = useState(false);
  useEffect(() => {
    document.title = "WDA";
    setShowDiv(true);
    return () => setShowDiv(false);
  }, []);

  const MergeData = (sourceId, targetId, Nodes) => {
    const sourceType = sourceId.split("_")[0];
    const targetType = targetId.split("_")[0];

    console.log(sourceType, targetType);

    if (sourceType !== targetType) {
      if (
        (sourceType === "Service" && targetType === "Database") ||
        (sourceType === "UI" && targetType === "Database")
      ) {
        let AllNodes = { ...Nodes };
        let sourceNode = AllNodes[sourceId];
        let targetNode = AllNodes[targetId];
        console.log(sourceNode, targetNode);
        AllNodes[sourceId].data = {
          ...sourceNode.data,
          prodDatabaseType: targetNode.data.prodDatabaseType,
        };
        setNodes({ ...AllNodes });
      }
    }
  };

  const onsubmit = (Data) => {
    const NewNodes = { ...nodes };
    const NewEdges = { ...edges };
    let Service_Discovery_Data = nodes["serviceDiscoveryType"]?.data;
    let authenticationData = nodes["authenticationType"]?.data;
    let logManagementData = nodes["logManagement"]?.data;
    if (logManagementData && Data?.deployment)
      Data.deployment.enableECK = "true";
    if (Data.deployment && Service_Discovery_Data?.serviceDiscoveryType)
      Data.deployment = { ...Data.deployment, ...Service_Discovery_Data };
    for (const key in NewNodes) {
      const Node = NewNodes[key];
      delete Node.data?.color;
      if (Node.id.startsWith("Service") || Node.id === "UI")
        Node.data = {
          ...Node.data,
          ...Service_Discovery_Data,
          ...authenticationData,
          ...logManagementData,
        };
    }
    if (Object.values(NewNodes).some((node) => node.data)) {
      Data["services"] = {};
      let serviceIndex = 0;
      for (const nodeInfo in NewNodes) {
        const Node = NewNodes[nodeInfo];
        if (Node.data) {
          if (Node.id.startsWith("Service") || Node.id === "UI") {
            Data["services"][serviceIndex++] = Node.data;
          }
        }
      }
    }
    if (
      Object.values(NewEdges).some(
        (edge) => edge.data && JSON.stringify(edge.data) !== "{}"
      )
    ) {
      console.log("object");
      Data["communications"] = {};
      let communicationIndex = 0;
      for (const edgeInfo in NewEdges) {
        const Edge = NewEdges[edgeInfo];
        if (!Edge.target.startsWith("Database")) {
          Edge.data.client = nodes[Edge.source].data.applicationName;
          Edge.data.server = nodes[Edge.target].data.applicationName;
          if (
            Edge.data &&
            Object.keys(Edge.data).length !== 0 &&
            !Edge.target.startsWith("Database")
          )
            Data["communications"][communicationIndex++] = Edge.data;
        }
      }
    }
    if (saveMetadata) {
      Data["metadata"] = {
        nodes: nodes,
        edges: edges,
        deployment: Data?.deployment,
      };
    } else delete Data?.metadata;
    console.log(Data, "Finaaal Dataaaaaaaaaa");
    setNodes(NewNodes);

    setIsLoading(true);
    fetch(process.env.REACT_APP_API_BASE_URL + "/generate", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
      },
      body: JSON.stringify(Data),
    })
      .then((response) => response.blob())
      .then((blob) => {
        setIsLoading(false);
        saveAs(blob, `${Data.projectName}.zip`); // Edit the name or ask the user for the project Name
      })
      .catch((error) => console.error(error))
      .finally(() => {
        window.location.replace("../../");
      });
  };
  const onCheckEdge = (edges) => {
    let NewEdges = { ...edges };
    for (const key in NewEdges) {
      const Edge = NewEdges[key];
      if (Edge.id.startsWith("UI")) {
        if (
          Edge.data.type === "synchronous" &&
          Edge.data.framework === "rest-api"
        ) {
          delete Edge.data.type;
          delete Edge.data.framework;
        }
      }
    }
  };

  const onEdgeClick = (e, edge) => {
    const sourceType = edge.source.split("_")[0];
    const targetType = edge.target.split("_")[0];
    console.log(e, edge);
    if (
      (sourceType === "UI" && targetType === "Service") ||
      (sourceType === "Service" && targetType === "Service")
    ) {
      setEdgeopen(edge.id);
      setCurrentEdge(edges[edge.id].data);
    }
  };

  const handleEdgeData = (Data) => {
    console.log(Data, IsEdgeopen);
    let UpdatedEdges = { ...edges };

    if (Data.framework === "rest-api" && isServiceDiscovery) {
      UpdatedEdges[IsEdgeopen].label = "Rest";
    } else {
      UpdatedEdges[IsEdgeopen].label = "RabbitMQ";
    }

    if (Data.type === "synchronous") {
      UpdatedEdges[IsEdgeopen].markerEnd = {
        color: "black",
        type: MarkerType.ArrowClosed,
      };
      UpdatedEdges[IsEdgeopen].style = { stroke: "black" };
    } else {
      UpdatedEdges[IsEdgeopen].markerEnd = {
        color: "#e2e8f0",
        type: MarkerType.ArrowClosed,
      };
      UpdatedEdges[IsEdgeopen].style = { stroke: "#bcbaba" };
    }

    UpdatedEdges[IsEdgeopen].data = {
      client: UpdatedEdges[IsEdgeopen].source,
      server: UpdatedEdges[IsEdgeopen].target,
      ...UpdatedEdges[IsEdgeopen].data,
      ...Data,
    };

    setEdges(UpdatedEdges);
    setEdgeopen(false);
  };

  const onConnect = useCallback((params, Nodes) => {
    params.markerEnd = { type: MarkerType.ArrowClosed };
    params.type = "smoothstep";
    params.data = {};
    const targetNode = Nodes[params.target];

    if (targetNode.id.startsWith("Database")) {
      if (
        !Nodes[params.source]?.data["prodDatabaseType"] &&
        !targetNode.data.isConnected
      ) {
        targetNode.data.isConnected = true;
        setEdges((eds) => addEdge(params, eds, Nodes));
        MergeData(params.source, params.target, Nodes);
      }
    } else {
      setEdges((eds) => addEdge(params, eds, Nodes));
    }
  }, []);

  const UpdateSave = () => {
    setsaveMetadata((prev) => !prev);
  };

  const [uniqueApplicationNames, setUniqueApplicationNames] = useState([]);

  const [selectedColor, setSelectedColor] = useState("");

  const handleColorClick = (color) => {
    let UpdatedNodes = { ...nodes };
    setSelectedColor(color);
    (UpdatedNodes[nodeClick].style ??= {}).backgroundColor = color;
    setNodes(UpdatedNodes);
  };

  return (
    <div className="dndflow" style={{ overflow: "hidden !important", bottom:0 }}>
      <ReactFlowProvider>
        <div
          className="reactflow-wrapper"
          ref={reactFlowWrapper}
          style={{
            width: "100%",
            height: "94vh",
            backgroundImage:
              "linear-gradient(to right, #f2f2f2 1px, transparent 1px), linear-gradient(to bottom, #f2f2f2 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          {showDiv && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-60%, -50%)",
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                padding: "50px",
                justifyContent: "center",
                border: "2px dashed #cfcfcf",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <FiUploadCloud
                  style={{
                    fontSize: "62px",
                    color: "#c3c3c3",
                    marginBottom: "30px",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: "38px",
                  fontWeight: "500",
                  marginBottom: "10px",
                }}
              >
                Drag and drop components here
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "300",
                  marginBottom: "30px",
                  color: "#c3c3c3",
                }}
              >
                To design your architecture
              </div>
              <Button
                mt={4}
                border="2px"
                borderColor="#3182CE"
                alignContent="center"
                color="#3182CE"
                style={{ margin: "0 auto" }}
              >
                Drag & Drop{" "}
                <ArrowRightIcon
                  style={{ marginLeft: "10px", fontSize: "11px" }}
                />
              </Button>
            </div>
          )}
          <ReactFlow
            nodes={Object.values(nodes)}
            edges={Object.values(edges)}
            nodeTypes={nodeTypes}
            snapToGrid
            connectionLineType={ConnectionLineType.Step}
            snapGrid={[20, 20]}
            onNodesChange={(changes) =>
              onNodesChange(setShowDiv, edges, changes)
            }
            onEdgesChange={(changes) => onEdgesChange(nodes, changes)}
            onConnect={(params) => onConnect(params, nodes)}
            onInit={setReactFlowInstance}
            onDrop={(e) =>
              onDrop(
                e,
                ServiceDiscoveryCount,
                MessageBrokerCount,
                LogManagemntCount,
                AuthProviderCount,
                LocalenvironmentCount
              )
            }
            onDragOver={onDragOver}
            onNodeDoubleClick={onclick}
            onNodeClick={onSingleClick}
            deleteKeyCode={["Backspace","Delete"]}
            fitView
            onEdgeUpdate={(oldEdge, newConnection) =>
              onEdgeUpdate(nodes, oldEdge, newConnection)
            }
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={(_, edge) => onEdgeUpdateEnd(nodes, edge)}
            onEdgeDoubleClick={onEdgeClick}
            nodesFocusable={true}
          >
            <Controls />
            <MiniMap style={{ backgroundColor: "#3182CE" }} />
          </ReactFlow>
        </div>
        <Sidebar
          isUINodeEnabled={isUINodeEnabled}
          Service_Discovery_Data={nodes["serviceDiscoveryType"]?.data}
          authenticationData={nodes["authenticationType"]?.data}
          nodes={nodes}
          onSubmit={onsubmit}
          saveMetadata={saveMetadata}
          Togglesave={UpdateSave}
          isLoading={isLoading}
          isEmptyUiSubmit={isEmptyUiSubmit}
          isEmptyServiceSubmit={isEmptyServiceSubmit}
          selectedColor={selectedColor}
          handleColorClick={handleColorClick}
          nodeClick={nodeClick}
          edges={edges}
        />

        {nodeType === "UI" && Isopen && (
          <UiDataModal
            isOpen={Isopen}
            CurrentNode={CurrentNode}
            onClose={setopen}
            onSubmit={onChange}
          />
        )}
        {nodeType === "Service" && Isopen && (
          <ServiceModal
            isOpen={Isopen}
            CurrentNode={CurrentNode}
            onClose={setopen}
            onSubmit={onChange}
            uniqueApplicationNames={uniqueApplicationNames}
          />
        )}
        {nodeType === "group" && Isopen && (
          <GroupDataModal
            isOpen={Isopen}
            CurrentNode={CurrentNode}
            onClose={setopen}
            onSubmit={onChange}
          />
        )}

        {IsEdgeopen && (
          <EdgeModal
            isOpen={IsEdgeopen}
            CurrentEdge={CurrentEdge}
            onClose={setEdgeopen}
            handleEdgeData={handleEdgeData}
            isServiceDiscovery={isServiceDiscovery}
            isMessageBroker={isMessageBroker}
          />
        )}

        {ServiceDiscoveryCount === 2 && (
          <AlertModal
            isOpen={true}
            onClose={() => setServiceDiscoveryCount(1)}
          />
        )}

        {MessageBrokerCount === 2 && (
          <AlertModal isOpen={true} onClose={() => setMessageBrokerCount(1)} />
        )}

        {CloudProviderCount === 2 && (
          <AlertModal isOpen={true} onClose={() => setCloudProviderCount(1)} />
        )}
        {LogManagemntCount === 2 && (
          <AlertModal isOpen={true} onClose={() => setLogManagementCount(1)} />
        )}
        {LocalenvironmentCount === 2 && (
          <AlertModal
            isOpen={true}
            onClose={() => setLocalenvironmentCount(1)}
          />
        )}
        {AuthProviderCount === 2 && (
          <AlertModal isOpen={true} onClose={() => setAuthProviderCount(1)} />
        )}
      </ReactFlowProvider>
    </div>
  );
};

export default Designer;
