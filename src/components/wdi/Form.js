import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import Confetti from "react-confetti";
import useWindowDimensions from "../../Hooks/useWindowDimensions";
import {
  Container,
  FormControl,
  FormLabel,
  Select,
  Input,
  Button,
  Heading,
} from "@chakra-ui/react";

function FormWdi(props) {
  const { generateInfrastructure, isContainerVisible, wdi } = props;
  const { height, width } = useWindowDimensions();
  const [party, setParty] = useState(false);
  const [projectName, setProjectName] = useState("example");
  const [domain, setDomain] = useState("example.com");
  const [cloudProvider, setCloudProvider] = useState("aws");
  const [awsRegion, setAwsRegion] = useState("ap-south-1");
  const [awsAccountId, setAwsAccountId] = useState("379605592402");
  const [orchestration, setOrchestration] = useState("kubernetes");
  const [instanceType, setInstanceType] = useState("t3.medium");
  const [clusterName, setClusterName] = useState("demo-cluster");
  const [nameSpace, setNameSpace] = useState("k8s");
  const [ingress, setIngress] = useState("istio");
  const [monitoring, setMonitoring] = useState("true");
  const [k8sWebUI, setK8sWebUI] = useState("true");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(process.env.REACT_APP_API_BASE_URL + "/generate", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectName: projectName,
        domain: domain,
        cloudProvider: cloudProvider,
        orchestration: orchestration,
        awsRegion: awsRegion,
        awsAccountId: awsAccountId,
        awsAccessKey: "<awsAccessKey>",
        awsSecretKey: "<awsSecretKey>",
        // instanceType: instanceType,  // can be added in the future
        // namespace: nameSpace,        // can be added in the future
        clusterName: clusterName,
        ingress: ingress,
        monitoring: monitoring,
        k8sWebUI: k8sWebUI,
      }),
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Other way to downlaod the zip at client side.
        /* const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'file.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); */
        saveAs(blob, `${projectName}.zip`);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setTimeout(() => setParty(true));
      });
  };

  useEffect(() => {
    if (party) {
      setTimeout(() => {
        setParty(false);
      }, 5000);
    }
  }, [party]);

  /**
   * NOTE:- don't add default value option for the select component
   * as it wont work , we are handling it with defining the values at useState
   */

  return (
    <Container maxW="2xl">
      {!generateInfrastructure && !isContainerVisible && !wdi && (
        <Heading marginBottom="10px" marginTop="16px">
          WDI
        </Heading>
      )}
      <FormControl isRequired>
        {!isContainerVisible && !generateInfrastructure && (
          <>
            <FormLabel>Enter Project Name</FormLabel>
            <Input
              type="text"
              placeholder="example"
              marginBottom="10px"
              onChange={(e) => setProjectName(e.target.value)}
              value={projectName}
            />
            <FormLabel>Enter your Domain Name</FormLabel>
            <Input
              type="text"
              placeholder="example.com"
              marginBottom="10px"
              onChange={(e) => setDomain(e.target.value)}
              value={domain}
            />
            <FormLabel>Select Cloud Provider</FormLabel>
            <Select
              marginBottom="10px"
              onChange={(e) => setCloudProvider(e.target.value)}
              value={cloudProvider}
            >
              <option value="aws">Aws Cloud</option>
              <option value="azure">Azure Cloud</option>
              <option value="gcp">Google Cloud Platform</option>
            </Select>

            {cloudProvider === "aws" && (
              <>
                <FormLabel>Account ID</FormLabel>
                <Input
                  type="text"
                  placeholder="379605592402"
                  marginBottom="10px"
                  onChange={(e) => setAwsAccountId(e.target.value)}
                  value={awsAccountId}
                />
                <FormLabel>Select region</FormLabel>
                <Select
                  marginBottom="10px"
                  onChange={(e) => setAwsRegion(e.target.value)}
                  value={awsRegion}
                >
                  <option value="ap-south-1">Asia Pacific (Mumbai)</option>
                  <option value="us-east-2">US East (Ohio)</option>
                  <option value="ap-east-1">Asia Pacific (Hong Kong)</option>
                </Select>
              </>
            )}

            <FormLabel>Select Orchestration Provider:</FormLabel>
            <Select
              onChange={(e) => setOrchestration(e.target.value)}
              value={orchestration}
              marginBottom="10px"
            >
              <option value="kubernetes">Kubernetes</option>
              <option value="swarm">Docker Swarm</option>
              <option value="mesos">Apache MESOS</option>
            </Select>

            {/* {cloudProvider === 'aws' && orchestration === 'kubernetes' &&
            
              (<div>
                <FormLabel>Select instance type</FormLabel>
                <Select marginBottom="10px"
                  onChange={(e) => setInstanceType(e.target.value)}
                  value={instanceType}
                >
                  <option value="t3.medium">t3.medium</option>
                  <option value="t3.large">t3.large</option>
                  <option value="t3.xlarge">t3.xlarge</option>
                </Select>
              </div>)
            } */}

            {orchestration === "kubernetes" && (
              <div>
                <FormLabel>Enter Cluster Name</FormLabel>
                <Input
                  type="text"
                  placeholder="demo-cluster"
                  marginBottom="10px"
                  onChange={(e) => setClusterName(e.target.value)}
                  value={clusterName}
                />
                {/* <FormLabel>Enter Kubernetes Namespace</FormLabel>
                  <Input
                    type="text"
                    placeholder="k8s"
                    marginBottom="10px"
                    onChange={(e) => setNameSpace(e.target.value)}
                    value={nameSpace}
                  /> */}
                <FormLabel>Select Ingress type:</FormLabel>
                <Select
                  onChange={(e) => setIngress(e.target.value)}
                  value={ingress}
                  marginBottom="10px"
                >
                  <option value="istio">Istio</option>
                  <option value="nginx">Nginx</option>
                  <option value="traefik">Traefik</option>
                </Select>
                <FormLabel>Enable Monitoring:</FormLabel>
                <Select
                  onChange={(e) => setMonitoring(e.target.value)}
                  value={monitoring}
                  marginBottom="10px"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
                <FormLabel>Enable Web UI:</FormLabel>
                <Select
                  onChange={(e) => setK8sWebUI(e.target.value)}
                  value={k8sWebUI}
                  marginBottom="10px"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </div>
            )}
          </>
        )}
        {!generateInfrastructure && !isContainerVisible && !wdi && (
          <Button
            onClick={handleSubmit}
            mt={4}
            border="2px"
            borderColor="green.500"
            width="100px"
            type="submit"
          >
            Submit
          </Button>
        )}
      </FormControl>

      {party && <Confetti width={width} height={height} />}
    </Container>
  );
}

export default FormWdi;
