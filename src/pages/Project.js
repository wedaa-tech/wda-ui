import { useEffect, useRef, useState } from "react";
import ReactFlow, { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import { useLocation } from "react-router-dom";
import CustomImageNode from "./Customnodes/CustomImageNode";
import CustomServiceNode from "./Customnodes/CustomServiceNode";
import CustomIngressNode from "./Customnodes/CustomIngressNode";
import CustomAuthNode from "./Customnodes/CustomAuthNode";
import CustomMessageBrokerNode from "./Customnodes/CustomMessageBrokerNode";
import CustomCloudNode from "./Customnodes/CustomCloudNode";
import CustomLoadNode from "./Customnodes/CustomLoadNode";
import CustomLocalenvironmentNode from "./Customnodes/CustomLocalenvironmentNode";
import ProjectModal from "../components/Modal/ProjectModal";
import DeploymentModal from "../components/Modal/DeploymentModal";
import ReadOnlyEdgeModal from "../components/Modal/ReadOnlyEdgeModal";

const readOnlyNodeStyle = {
  border: "1px solid #ccc",
  background: "#f0f0f0",
  color: "#555",
};

const readOnlyEdgeStyle = {
  stroke: "#ccc",
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
};

const Project = () => {
  const location = useLocation();
  const [metadata, setmetadata] = useState(location.state);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    const data = location?.state;
    console.log(data, metadata, "data");
    if (!data) {
      const data = JSON.parse(localStorage.metadata);
      setmetadata(data);
      setNodes(Object.values(data?.nodes));
      if (data?.edges) {
        setEdges(Object.values(data?.edges));
      }
    } else {
      localStorage.metadata = JSON.stringify(metadata);
      if (metadata?.nodes) {
        setNodes(Object.values(metadata?.nodes));
      } else if (metadata?.edges) {
        setEdges(Object.values(data?.edges));
      } else {
        setNodes([getDeploymentNode(metadata)]);
      }
      if (metadata?.edges) {
        setEdges(Object.values(metadata?.edges));
      }
    }
  }, [location?.state, metadata]);

  const reactFlowWrapper = useRef(null);
  const [serviceModal, setserviceModal] = useState(false);
  const [nodeType, setNodeType] = useState("");
  const [edgeModal, setEdgeModal] = useState(false);
  const [typeName, setTypeName] = useState("");
  const [cloudModal, setCloudModal] = useState(false);
  const [cloudName, setCloudName] = useState("");

  const DefaultAppData = {
    applicationName: "",
    clientFramework: "",
    packageName: "",
    serverPort: "",
    withExample: "",
    applicationFramework: "",
    type: "",
    framework: "",
  };

  const DefaultData = {
    awsAccountId: "",
    awsRegion: "",
    kubernetesStorageClassName: "",

    clusterName: "",
    deploymentType: "",
    ingressDomain: "",
    ingressType: "",
    k8sWebUI: "",
    kubernetesNamespace: "",
    kubernetesUseDynamicStorage: "",
    monitoring: "",

    azureLocation: "",
    subscriptionId: "",
    tenantId: "",

    dockerRepositoryName: "",
  };

  const [appData, setAppData] = useState(DefaultAppData);
  const [data, setData] = useState(DefaultData);

  const getDeploymentNode = (data) => {
    return {
      id: "Deployment",
      type: "selectorNode5",
      data: { data },
      style: { border: "1px solid #8c8d8f", padding: "4px 4px" },
      position: { x: 250, y: 5 },
    };
  };

  const onNodeClick = (event, element) => {
    event.preventDefault();
    if (element.data.applicationType === "gateway") {
      setNodeType("UI");
      setserviceModal(true);
      setAppData((prev) => ({
        ...prev,
        clientFramework: element.data.clientFramework,
        withExample: element.data.withExample,
      }));
    } else if (element.data.applicationType === "microservice") {
      setNodeType("Service");
      setserviceModal(true);
      setAppData((prev) => ({
        ...prev,
        applicationFramework: element.data.applicationFramework,
      }));
    } else if (element.data?.data?.cloudProvider === "aws") {
      setNodeType("Cloud");
      setCloudName("aws");
      setCloudModal(true);
      setData((prev) => ({
        ...prev,
        awsAccountId: element.data?.data?.awsAccountId,
        awsRegion: element.data?.data?.awsRegion,
        kubernetesStorageClassName:
          element.data?.data?.kubernetesStorageClassName,
      }));
    } else if (element.data?.data?.cloudProvider === "azure") {
      setNodeType("Cloud");
      setCloudName("azure");
      setCloudModal(true);
      setData((prev) => ({
        ...prev,
        azureLocation: element.data?.data?.azureLocation,
        subscriptionId: element.data?.data?.subscriptionId,
        tenantId: element.data?.data?.tenantId,
      }));
    } else if (element.data?.data?.cloudProvider === "minikube") {
      setNodeType("Cloud");
      setCloudName("minikube");
      setCloudModal(true);
      setData((prev) => ({
        ...prev,
        dockerRepositoryName: element.data?.data?.dockerRepositoryName,
      }));
    } else {
      setNodeType("other");
    }

    setAppData((prev) => ({
      ...prev,
      applicationName: element.data.applicationName,
      packageName: element.data.packageName,
      serverPort: element.data.serverPort,
    }));

    setData((prev) => ({
      ...prev,
      clusterName: element.data?.data?.clusterName,
      deploymentType: element.data?.data?.deploymentType,
      ingressDomain: element.data?.data?.ingressDomain,
      ingressType: element.data?.data?.ingressType,
      k8sWebUI: element.data?.data?.k8sWebUI,
      kubernetesNamespace: element.data?.data?.kubernetesNamespace,
      kubernetesUseDynamicStorage:
        element.data?.data?.kubernetesUseDynamicStorage,
      monitoring: element.data?.data?.monitoring,
    }));
  };

  const onEdgeClick = (event, element) => {
    console.log(element.data, "data");
    const EdgeData = element.data;
    if (EdgeData) {
      event.preventDefault();
      setEdgeModal(true);
      if (EdgeData.type === "synchronous") {
        setTypeName("synchronous");
      } else setTypeName("asynchronous");
      setData((prev) => ({
        ...prev,
        type: EdgeData.type,
        framework: EdgeData.framework,
      }));
    }
  };
  const handleContainerClose = () => {
    setserviceModal(false) || setEdgeModal(false) || setCloudModal(false);
  };

  return (
    <>
      <div className="dndflow">
        <ReactFlowProvider>
          <div
            className="reactflow-wrapper"
            ref={reactFlowWrapper}
            style={{ width: "100%", height: "90%" }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onEdgeClick={onEdgeClick}
              onNodeClick={onNodeClick}
              nodesConnectable={false}
              elementsSelectable={false}
              nodesDraggable={false}
              panOnDrag={false}
              fitView
              nodeTypes={{
                customReadOnlyNode: readOnlyNodeStyle,
                ...nodeTypes,
              }}
              edgeTypes={{
                customReadOnlyEdge: readOnlyEdgeStyle,
              }}
            />
          </div>
        </ReactFlowProvider>
      </div>
      {edgeModal && (
        <ReadOnlyEdgeModal
          edgeModal={edgeModal}
          type={data.type}
          typeName={typeName}
          framework={data.framework}
          handleContainerClose={handleContainerClose}
        />
      )}
      {nodeType === "UI" || nodeType === "Service" ? (
        <ProjectModal
          nodeType={nodeType}
          serviceModal={serviceModal}
          handleContainerClose={handleContainerClose}
          applicationName={appData.applicationName}
          clientFramework={appData.clientFramework}
          applicationFramework={appData.applicationFramework}
          packageName={appData.packageName}
          serverPort={appData.serverPort}
          withExample={appData.withExample}
        />
      ) : (
        <></>
      )}
      {nodeType === "Cloud" && (
        <DeploymentModal
          cloudModal={cloudModal}
          cloudName={cloudName}
          handleContainerClose={handleContainerClose}
          awsAccountId={data.awsAccountId}
          awsRegion={data.awsRegion}
          kubernetesStorageClassName={data.kubernetesStorageClassName}
          azureLocation={data.azureLocation}
          subscriptionId={data.subscriptionId}
          tenantId={data.tenantId}
          clusterName={data.clusterName}
          deploymentType={data.deploymentType}
          ingressDomain={data.ingressDomain}
          ingressType={data.ingressType}
          k8sWebUI={data.k8sWebUI}
          kubernetesNamespace={data.kubernetesNamespace}
          kubernetesUseDynamicStorage={data.kubernetesUseDynamicStorage}
          monitoring={data.monitoring}
          dockerRepositoryName={data.dockerRepositoryName}
        />
      )}
    </>
  );
};

export default Project;
