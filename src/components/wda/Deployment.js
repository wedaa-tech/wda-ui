import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Editable,
  EditableInput,
  EditablePreview,
  FormErrorMessage,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

function Deployment({ application, deployment, setDeployment }) {
  const isErrorRepoName = deployment.dockerRepositoryName === "";
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
        <option value="compose">Docker-Compose</option>
        <option value="openshift">Openshift</option>
      </Select>
      <FormLabel>Application Folders</FormLabel>
      {Object.keys(application).map((name, id) => {
        return (
          <Editable
            key={id}
            defaultValue={JSON.stringify(application[id].applicationName)}
          >
            <EditablePreview />
            <EditableInput />
          </Editable>
        );
      })}
      <FormControl isInvalid={isErrorRepoName}>
        <FormLabel>Docker Repository Name</FormLabel>
        <Input
          placeholder=""
          type="text"
          key="dockerRepositoryName"
          name="dockerRepositoryName"
          onChange={({ target }) =>
            handleInputChange("dockerRepositoryName", target.value)
          }
          defaultValue={deployment.dockerRepositoryName}
        />
        {!isErrorRepoName ? (
          <div style={{ marginBottom: "10px" }}></div>
        ) : (
          <FormErrorMessage marginBottom="10px" fontSize="10px" marginTop="5px">
            <WarningIcon marginRight="5px" />
            Required
          </FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={isErrorNamespace}>
        <FormLabel>Kubernetes Namespace</FormLabel>
        <Input
          placeholder="Wdi"
          type="text"
          key="kubernetesNamespace"
          name="kubernetesNamespace"
          onChange={({ target }) =>
            handleInputChange("kubernetesNamespace", target.value)
          }
          marginBottom="10px"
          defaultValue={deployment.kubernetesNamespace}
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
          <FormControl isInvalid={isErrorStorage}>
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
      <FormControl isInvalid={isErrorIngressDomain}>
        <FormLabel>Ingress Domain</FormLabel>
        <Input
          placeholder=""
          type="text"
          key="ingressDomain"
          name="ingressDomain"
          onChange={({ target }) =>
            handleInputChange("ingressDomain", target.value)
          }
          defaultValue={deployment.ingressDomain}
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
        <option value="nginx">Nginx</option>
      </Select>
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
