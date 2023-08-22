import { useHistory } from "react-router-dom";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import azure from "../../src/assets/Azure.png";
import aws from "../../src/assets/aws.png";
import minikube from "../../src/assets/mini.jpeg";
import Footer from "../components/Footer";
import DeploymentModal from "../components/Modal/DeploymentModal";
import DeleteModal from '../components/Modal/DeleteModal';

function Projects() {
  const history = useHistory();
  const [data, setData] = useState([]);
  const { keycloak, initialized } = useKeycloak();
  const [showData, setShowData] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [cloudName, setCloudName] = useState("");
  const [showModal, setShowModal] = useState({display:false,id:"",name:""});

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

  const [depData, setDepData] = useState(DefaultData);

  const handleClick = async (data, column, id) => {
    if (column === "Architecture")
      history.push({
        pathname: "/projects/" + id,
        state: data,
      });
    else {
      if (data) {
        if (data.cloudProvider === "aws") {
          setCloudName("aws");
          setDepData((prev) => ({
            ...prev,
            awsAccountId: data?.awsAccountId,
            awsRegion: data?.awsRegion,
            kubernetesStorageClassName: data?.kubernetesStorageClassName,
          }));
        } else if (data.cloudProvider === "azure") {
          setCloudName("azure");
          setDepData((prev) => ({
            ...prev,
            azureLocation: data?.azureLocation,
            subscriptionId: data?.subscriptionId,
            tenantId: data?.tenantId,
          }));
        } else {
          setCloudName("minikube");
          setDepData((prev) => ({
            ...prev,
            dockerRepositoryName: depData?.dockerRepositoryName,
          }));
        }
        setDepData((prev) => ({
          ...prev,
          clusterName: data?.clusterName,
          deploymentType: data?.deploymentType,
          ingressDomain: data?.ingressDomain,
          ingressType: data?.ingressType,
          k8sWebUI: data?.k8sWebUI,
          kubernetesNamespace: data?.kubernetesNamespace,
          kubernetesUseDynamicStorage: data?.kubernetesUseDynamicStorage,
          monitoring: data?.monitoring,
        }));
        await setShowData(true);
        await setModalData(() => ({ ...data }));
      }
    }
  };

  useEffect(() => {
    if (initialized) {
      fetch(process.env.REACT_APP_API_BASE_URL + "/api/blueprints", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if(result?.data){
           setData(result.data);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [initialized, keycloak]);

  const handleContainerClose = () => {
    setShowData(false);
  };
  
  const handleButtonClick = (val,projectName) => {
    setShowModal({display:true,id:val,name:projectName});
  };

  const handleCloseModal = () => {
    setShowModal({...modalData,display:false});
  };

  const onSubmit =async (data) =>{
    const response = await fetch(process.env.REACT_APP_API_BASE_URL + "/api/blueprints/" + data.id, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
      },
    })
    .catch((error) => console.error(error))
    .finally(() => {
      window.location.replace("../../projects");
    });
  }

  const verifyData = async (data,id) => {
      try {
          const response = await fetch(
            process.env.REACT_APP_API_BASE_URL + "/api/user/" + id,
            {
              method: "get",
              headers: {
                "Content-Type": "application/json",
                Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
              },
            }
          );
          if(response.ok)
          {
            history.push({
              pathname: "/edit/" + id,
              state: data,
            });
          }
          else
          {
            console.error("You are not authorized");
            window.location.replace("../../");
          }
      } catch (error) {
        console.error(error);
        
        }
  };

  return (
    <div>
      <TableContainer sx={{ margin: "5%" }}>
        <Table size="sm" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>S.No</Th>
              <Th>Project</Th>
              <Th>Infrastructure</Th>
              <Th>Edit</Th>
              <Th>Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((project, index) => {
              return (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <Button
                      colorScheme="teal"
                      variant="link"
                      onClick={(e) =>
                        handleClick(
                          project,
                          "Architecture",
                          project.project_id
                        )
                      }
                      _hover={{
                        transform: "scale(1.1)",
                        transition: "transform 0.3s",
                        fontWeight: "bolder",
                        color: "red",
                      }}
                    >
                      {project.projectName}
                    </Button>
                  </Td>
                  {project.metadata?.deployment ? (
                    <Td>
                      <Button
                        colorScheme="teal"
                        variant="link"
                        onClick={(e) =>
                          handleClick(
                            project.metadata?.deployment,
                            "Infrastructure",
                            project.projectName
                          )
                        }
                        _hover={{
                          transform: "scale(1.1)",
                          transition: "transform 0.3s",
                          fontWeight: "bolder",
                          color: "red",
                        }}
                      >
                        {project.metadata.deployment.cloudProvider ===
                        "azure" ? (
                          <img width="40px" src={azure} alt="azure" />
                        ) : project.metadata.deployment.cloudProvider ===
                          "aws" ? (
                          <img width="40px" src={aws} alt="aws" />
                        ) : (
                          <img width="40px" src={minikube} alt="minikube" />
                        )}
                      </Button>
                    </Td>
                  ) : (
                    <Td>
                      <span style={{ lineHeight: "40px" }}>NA</span>
                    </Td>
                  )}
                  <Td>
                   <button style={{ paddingLeft: '7px'}} onClick={(e)=>verifyData(project,project.project_id)}><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                  </Td>
                  <Td>
                  <button style={{ paddingLeft: '10px'}} onClick={(e)=>handleButtonClick(project.project_id,project.projectName)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path fill="none" d="M0 0h24v24H0z"/>
                      <path fill="#000000" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                    </svg>
                  </button>
                  </Td>
                </Tr>
              );
            })}
            
          </Tbody>
        </Table>
      </TableContainer>
      {showModal.display && (
        <>
          <DeleteModal
            onClose={handleCloseModal}
            id ={showModal.id}
            name={showModal.name}
            onSubmit={onSubmit}
          />
          </>
      )}
      {showData && (
        <>
          <DeploymentModal
            cloudModal={true}
            cloudName={cloudName}
            handleContainerClose={handleContainerClose}
            awsAccountId={depData.awsAccountId}
            awsRegion={depData.awsRegion}
            kubernetesStorageClassName={depData.kubernetesStorageClassName}
            azureLocation={depData.azureLocation}
            subscriptionId={depData.subscriptionId}
            tenantId={depData.tenantId}
            clusterName={depData.clusterName}
            deploymentType={depData.deploymentType}
            ingressDomain={depData.ingressDomain}
            ingressType={depData.ingressType}
            k8sWebUI={depData.k8sWebUI}
            kubernetesNamespace={depData.kubernetesNamespace}
            kubernetesUseDynamicStorage={depData.kubernetesUseDynamicStorage}
            monitoring={depData.monitoring}
            dockerRepositoryName={depData.dockerRepositoryName}
          />
        </>
      )}
      <Footer />
    </div>
  );
}

export default Projects;
