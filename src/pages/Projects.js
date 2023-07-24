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

function Projects() {
  const history = useHistory();

  const [data, setData] = useState([]);
  const { keycloak, initialized } = useKeycloak();
  const [showData, setShowData] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [cloudName, setCloudName] = useState("");

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

  const handleClick = async (data, column, name) => {
    if (column === "Architecture")
      history.push({
        pathname: "/projects/" + name,
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
          setData(result.data);
        })
        .catch((error) => console.error(error));
    }
  }, [initialized, keycloak]);

  const handleContainerClose = () => {
    setShowData(false);
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
                          project.metadata,
                          "Architecture",
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
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
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
