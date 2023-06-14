import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

function Infrastructure({ wdi, setWdi, checkLength, validateInputValue }) {
  const isErrorDomain = wdi.domain === "";
  const isErrorAccId = wdi.awsAccountId === "" || checkLength;
  const isErrorCluster = wdi.clusterName === "";

  const handleKeyPress = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || charCode === 8) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  };
  const handleInputChange = (field, value) => {
    validateInputValue(field, value);
    setWdi((app) => ({
      ...app,
      [field]: value,
    }));
  };

  return (
    <FormControl>
      <FormControl isInvalid={isErrorDomain} isRequired>
        <FormLabel>Enter your Domain Name</FormLabel>
        <Input
          type="text"
          placeholder="example.com"
          key="domain"
          name="domain"
          onChange={({ target }) => handleInputChange("domain", target.value)}
          defaultValue={wdi.domain}
          style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
        />
        {!isErrorDomain ? (
          <div style={{ marginBottom: "10px" }}></div>
        ) : (
          <FormErrorMessage marginBottom="10px" fontSize="10px" marginTop="5px">
            <WarningIcon marginRight="5px" />
            Required
          </FormErrorMessage>
        )}
      </FormControl>
      <FormLabel>Select Cloud Provider</FormLabel>
      <Select
        marginBottom="10px"
        key="cloudProvider"
        name="cloudProvider"
        onChange={({ target }) =>
          handleInputChange("cloudProvider", target.value)
        }
        defaultValue={wdi.cloudProvider}
      >
        <option value="aws">Aws Cloud</option>
        <option value="azure">Azure Cloud</option>
        <option value="gcp">Google Cloud Platform</option>
      </Select>

      {wdi.cloudProvider === "aws" && (
        <>
          <FormControl isInvalid={isErrorAccId} isRequired>
            <FormLabel>Account ID</FormLabel>
            <Input
              type="text"
              placeholder="123456789"
              onChange={({ target }) =>
                handleInputChange("awsAccountId", target.value)
              }
              onKeyPress={handleKeyPress}
              defaultValue={wdi.awsAccountId}
              maxLength="12"
              style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
            />
            {!isErrorAccId ? (
              <div style={{ marginBottom: "10px" }}></div>
            ) : (
              <FormErrorMessage
                marginBottom="10px"
                fontSize="10px"
                marginTop="5px"
              >
                <WarningIcon marginRight="5px" />
                {checkLength
                  ? "Input value must be at least 12 digits"
                  : "Required"}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormLabel>Select region</FormLabel>
          <Select
            marginBottom="10px"
            onChange={({ target }) =>
              handleInputChange("awsRegion", target.value)
            }
            defaultValue={wdi.awsRegion}
          >
            <option value="ap-south-1">Asia Pacific (Mumbai)</option>
            <option value="us-east-2">US East (Ohio)</option>
            <option value="ap-east-1">Asia Pacific (Hong Kong)</option>
          </Select>
        </>
      )}

      <FormLabel>Select Orchestration Provider:</FormLabel>
      <Select
        key="orchestration"
        name="orchestration"
        onChange={({ target }) =>
          handleInputChange("orchestration", target.value)
        }
        defaultValue={wdi.orchestration}
        marginBottom="10px"
      >
        <option value="kubernetes">Kubernetes</option>
        <option value="swarm">Docker Swarm</option>
        <option value="mesos">Apache MESOS</option>
      </Select>

      {/* {wdi.cloudProvider === "aws" && wdi.orchestration === "kubernetes" && (
        <div>
          <FormLabel>Select instance type</FormLabel>
          <Select
            marginBottom="10px"
            key="instanceType"
            name="instanceType"
            onChange={({ target }) =>
              handleInputChange("instanceType", target.value)
            }
            defaultValue={wdi.instanceType}
          >
            <option value="t3.medium">t3.medium</option>
            <option value="t3.large">t3.large</option>
            <option value="t3.xlarge">t3.xlarge</option>
          </Select>
        </div>
      )} */}

      {wdi.orchestration === "kubernetes" && (
        <div>
          <FormControl isInvalid={isErrorCluster} isRequired>
            <FormLabel>Enter Cluster Name</FormLabel>
            <Input
              type="text"
              placeholder="demo-cluster"
              key="clusterName"
              name="clusterName"
              onChange={({ target }) =>
                handleInputChange("clusterName", target.value)
              }
              defaultValue={wdi.clusterName}
              style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
            />
            {!isErrorCluster ? (
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
          {/* <FormLabel>Enter Kubernetes Namespace</FormLabel>
          <Input
            type="text"
            placeholder="K8s"
            marginBottom="10px"
            key="namespace"
            name="namespace"
            onChange={({ target }) =>
              handleInputChange("namespace", target.value)
            }
            defaultValue={wdi.namespace}
          /> */}
          <FormLabel>Select Ingress type:</FormLabel>
          <Select
            key="ingress"
            name="ingress"
            onChange={({ target }) =>
              handleInputChange("ingress", target.value)
            }
            defaultValue={wdi.ingress}
            marginBottom="10px"
          >
            <option value="istio">ISTIO</option>
            <option value="nginx">Nginx</option>
            <option value="traefik">Traefik</option>
          </Select>
          <FormLabel>Enable Monitoring:</FormLabel>
          <Select
            onChange={({ target }) =>
              handleInputChange("monitoring", target.value)
            }
            defaultValue={wdi.monitoring}
            marginBottom="10px"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
          <FormLabel>Enable Elastic Cloud:</FormLabel>
          <Select
            onChange={({ target }) =>
              handleInputChange("enableECK", target.value)
            }
            defaultValue={wdi.enableECK}
            marginBottom="10px"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
          <FormLabel>Enable Web UI:</FormLabel>
          <Select
            onChange={({ target }) =>
              handleInputChange("k8sWebUI", target.value)
            }
            defaultValue={wdi.k8sWebUI}
            marginBottom="10px"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
        </div>
      )}
    </FormControl>
  );
}

export default Infrastructure;
