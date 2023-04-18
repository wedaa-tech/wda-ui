import React, { useState, useEffect } from "react";
import { FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { wdiPreFlightTemplate } from "./assert";

function Infrastructure({ wdi, setWdi }) {
  const [inputs, setInputs] = useState(
    JSON.parse(localStorage.getItem("wdi")) || {wdiPreFlightTemplate}
  );

  useEffect(() => {
    localStorage.getItem("wdi", JSON.stringify(inputs));
  }, [inputs]);

  const handleInputChange = (field, value) => {
    setInputs(() => ({
      ...inputs,
      [field]: value,
    }));
    setWdi((app) => ({
      ...app,
      [field]: value,
    }));
    localStorage.setItem(
      "wdi",
      JSON.stringify({
        ...inputs,
        [field]: value,
      })
    );
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
        value={inputs.domain}
      />
      <FormLabel>Select Cloud Provider</FormLabel>
      <Select
        marginBottom="10px"
        key="cloudProvider"
        name="cloudProvider"
        onChange={({ target }) =>
          handleInputChange("cloudProvider", target.value)
        }
        value={inputs.cloudProvider}
      >
        <option value="aws">Aws Cloud</option>
        <option value="azure">Azure Cloud</option>
        <option value="gcp">Google Cloud Platform</option>
      </Select>

      {inputs.cloudProvider === "aws" && (
        <>
        <FormLabel>Account ID</FormLabel>
        <Input
          type="text"
          placeholder="379605592402"
          marginBottom="10px"
          onChange={({ target }) =>
          handleInputChange("awsAccountId", target.value)
        }
          value={inputs.awsAccountId}
        />
        <FormLabel>Select region</FormLabel>
        <Select
          marginBottom="10px"
          onChange={({ target }) =>
          handleInputChange("awsRegion", target.value)
        }
          value={inputs.awsRegion}
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
        value={inputs.orchestration}
        marginBottom="10px"
      >
        <option value="kubernetes">Kubernetes</option>
        <option value="swarm">Docker Swarm</option>
        <option value="mesos">Apache MESOS</option>
      </Select>

      {/* {inputs.cloudProvider === "aws" && inputs.orchestration === "kubernetes" && (
        <div>
          <FormLabel>Select instance type</FormLabel>
          <Select
            marginBottom="10px"
            key="instanceType"
            name="instanceType"
            onChange={({ target }) =>
              handleInputChange("instanceType", target.value)
            }
            value={inputs.instanceType}
          >
            <option value="t3.medium">t3.medium</option>
            <option value="t3.large">t3.large</option>
            <option value="t3.xlarge">t3.xlarge</option>
          </Select>
        </div>
      )} */}

      {inputs.orchestration === "kubernetes" && (
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
            value={inputs.clusterName}
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
            value={inputs.namespace}
          />
          <FormLabel>Select Ingress type:</FormLabel>
          <Select
            key="ingress"
            name="ingress"
            onChange={({ target }) =>
              handleInputChange("ingress", target.value)
            }
            value={inputs.ingress}
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
