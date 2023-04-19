import React from "react";
import { FormControl, FormLabel, Input, Select } from "@chakra-ui/react";

function Infrastructure({ wdi, setWdi }) {
  const handleInputChange = (field, value) => {
    setWdi((app) => ({
      ...app,
      [field]: value,
    }));
  };

  return (
    <FormControl>
     <FormLabel>Enter your Domain Name</FormLabel>
      <Input
        type="text"
        placeholder="Example.com"
        marginBottom="10px"
        key="domain"
        name="domain"
        onChange={({ target }) => handleInputChange("domain", target.value)}
        defaultValue={wdi.domain}
      />
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
        <FormLabel>Account ID</FormLabel>
        <Input
          type="text"
          placeholder="379605592402"
          marginBottom="10px"
          onChange={({ target }) =>
          handleInputChange("awsAccountId", target.value)
        }
          defaultValue={wdi.awsAccountId}
        />
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
          <FormLabel>Enter Cluster Name</FormLabel>
          <Input
            type="text"
            placeholder="Demo-cluster"
            marginBottom="10px"
            key="clusterName"
            name="clusterName"
            onChange={({ target }) =>
              handleInputChange("clusterName", target.value)
            }
            defaultValue={wdi.clusterName}
          />
          <FormLabel>Enter Kubernetes Namespace</FormLabel>
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
          />
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
            <option value="istio">Istio</option>
            <option value="nginx">Nginx</option>
            <option value="traefik">Traefik</option>
          </Select>
        </div>
      )}
    </FormControl>
  );
}

export default Infrastructure;
