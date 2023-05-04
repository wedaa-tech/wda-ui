import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  FormErrorMessage,
} from "@chakra-ui/react";
import { MinusIcon, WarningIcon } from "@chakra-ui/icons";

function Deployment({ application, deployment, setDeployment }) {
  const isErrorNamespace = deployment.kubernetesNamespace === "";
  const isErrorStorage = deployment.kubernetesStorageClassName === "";
  const isErrorIngressDomain = deployment.ingressDomain === "";
  const handleInputChange = (field, value) => {
    setDeployment((app) => ({
      ...app,
      [field]: value,
    }));
  };

  return (
    <FormControl>
      <FormLabel>Deployment Type</FormLabel>
      <Select
        key="deploymentType"
        name="deploymentType"
        onChange={({ target }) =>
          handleInputChange("deploymentType", target.value)
        }
        marginBottom="10px"
        defaultValue={deployment.deploymentType}
      >
        <option value="kubernetes">Kubernetes</option>
        {/* <option value="compose">Docker-Compose</option>
        <option value="openshift">Openshift</option> */}
      </Select>
      {Object.values(application).filter((app) => app.applicationName !== "")
        .length > 0 && (
        <>
          <FormLabel>Application Folders</FormLabel>
          <div
            style={{
              border: "1px solid #cfcfcf",
              marginBottom: "10px",
              paddingLeft: "20px",
              backgroundColor: "#F5F5F5",
            }}
          >
            {Object.values(application).map((applicationItem, id) => {
              return (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <MinusIcon
                    fontSize="8px"
                    marginTop="12px"
                    marginRight="8px"
                  />
                  <Text
                    key={id}
                    value={applicationItem.applicationName}
                    marginTop="5px"
                    marginBottom="5px"
                    marginRight="20px"
                    paddingRight="20px"
                  >
                    {applicationItem.applicationName}
                  </Text>
                </div>
              );
            })}
          </div>
          </>
      )}
      <FormControl isInvalid={isErrorNamespace} isRequired>
        <FormLabel>Kubernetes Namespace</FormLabel>
        <Input
          placeholder="Wdi"
          type="text"
          key="kubernetesNamespace"
          name="kubernetesNamespace"
          onChange={({ target }) =>
            handleInputChange("kubernetesNamespace", target.value)
          }
          defaultValue={deployment.kubernetesNamespace}
          style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
        />
        {!isErrorNamespace ? (
          <div style={{ marginBottom: "10px" }}></div>
        ) : (
          <FormErrorMessage marginBottom="10px" fontSize="10px" marginTop="5px">
            <WarningIcon marginRight="5px" />
            Required
          </FormErrorMessage>
        )}
      </FormControl>
      {/* <FormLabel>Kubernetes Service Type</FormLabel>
      <Select
        key="kubernetesServiceType"
        name="kubernetesServiceType"
        onChange={({ target }) =>
          handleInputChange("kubernetesServiceType", target.value)
        }
        marginBottom="10px"
        defaultValue={deployment.kubernetesServiceType}
      >
        <option value="loadBalancer">LoadBalancer</option>
        <option value="nodePort">NodePort</option>
        <option value="ingress">Ingress</option>
      </Select> */}
      <FormLabel>Enable Kubernetes Dynamic Storage</FormLabel>
      <Select
        key="kubernetesUseDynamicStorage"
        name="kubernetesUseDynamicStorage"
        onChange={({ target }) =>
          handleInputChange("kubernetesUseDynamicStorage", target.value)
        }
        marginBottom="10px"
        defaultValue={deployment.kubernetesUseDynamicStorage}
      >
        <option value="true">Yes</option>
        <option value="false">No</option>
      </Select>

      {deployment.kubernetesUseDynamicStorage === "true" && (
        <>
          <FormControl isInvalid={isErrorStorage} isRequired>
            <FormLabel>Kubernetes Storage Class Name</FormLabel>
            <Input
              placeholder="demoStorageClass"
              type="text"
              key="kubernetesStorageClassName"
              name="kubernetesStorageClassName"
              onChange={({ target }) =>
                handleInputChange("kubernetesStorageClassName", target.value)
              }
              defaultValue={deployment.kubernetesStorageClassName}
              style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
            />
            {!isErrorStorage ? (
              <div style={{ marginBottom: "10px" }}></div>
            ) : (
              <FormErrorMessage
                marginBottom="10px"
                fontSize="10px"
                marginTop="5px"
              >
                <WarningIcon marginRight="5px" />
                Required
              </FormErrorMessage>
            )}
          </FormControl>
        </>
      )}
      {/* <FormLabel>Kubernetes Storage Provisioner</FormLabel>
      <Input
        placeholder="demoStorageClass"
        type="text"
        key="kubernetesStorageClassName"
        name="kubernetesStorageClassName"
        onChange={({ target }) =>
          handleInputChange("kubernetesStorageClassName", target.value)
        }
        marginBottom="10px"
        defaultValue={deployment.kubernetesStorageClassName}
      /> */}

      <FormLabel>Ingress Type</FormLabel>
      <Select
        key="ingressType"
        name="ingressType"
        onChange={({ target }) =>
          handleInputChange("ingressType", target.value)
        }
        marginBottom="10px"
        defaultValue={deployment.ingressType}
      >
        <option value="istio">ISTIO</option>
        {/* <option value="nginx">Nginx</option> */}
      </Select>
      <FormControl isInvalid={isErrorIngressDomain} isRequired>
        <FormLabel>Domain name</FormLabel>
        <Input
          placeholder="example.com"
          type="text"
          key="ingressDomain"
          name="ingressDomain"
          onChange={({ target }) =>
            handleInputChange("ingressDomain", target.value)
          }
          defaultValue={deployment.ingressDomain}
          style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
        />
        {!isErrorIngressDomain ? (
          <div style={{ marginBottom: "10px" }}></div>
        ) : (
          <FormErrorMessage marginBottom="10px" fontSize="10px" marginTop="5px">
            <WarningIcon marginRight="5px" />
            Required
          </FormErrorMessage>
        )}
      </FormControl>
      <FormLabel>Service Discovery Type</FormLabel>
      <Select
        key="serviceDiscoveryType"
        name="serviceDiscoveryType"
        onChange={({ target }) =>
          handleInputChange("serviceDiscoveryType", target.value)
        }
        marginBottom="10px"
        defaultValue={deployment.serviceDiscoveryType}
      >
        <option value="eureka">Eureka</option>
        <option value="consul">Consul</option>
        <option value="no">No</option>
      </Select>
      {/* <FormLabel>Monitoring</FormLabel>
      <Select
        key="monitoring"
        name="monitoring"
        onChange={({ target }) => handleInputChange("monitoring", target.value)}
        marginBottom="10px"
        defaultValue={deployment.monitoring}
      >
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select> */}
    </FormControl>
  );
}

export default Deployment;
