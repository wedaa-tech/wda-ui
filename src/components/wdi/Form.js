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
  FormErrorMessage,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

function FormWdi(props) {
  const { generateInfrastructure, isContainerVisible, wdi } = props;
  const { height, width } = useWindowDimensions();
  const [party, setParty] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [domain, setDomain] = useState("");
  const [cloudProvider, setCloudProvider] = useState("aws");
  const [awsRegion, setAwsRegion] = useState("ap-south-1");
  const [awsAccountId, setAwsAccountId] = useState("");
  const [orchestration, setOrchestration] = useState("kubernetes");
  // const [instanceType, setInstanceType] = useState("t3.medium");
  const [clusterName, setClusterName] = useState("");
  // const [nameSpace, setNameSpace] = useState("k8s");
  const [ingress, setIngress] = useState("istio");
  const [monitoring, setMonitoring] = useState("true");
  const [enableECK, setEnableECK] = useState("true");
  const [k8sWebUI, setK8sWebUI] = useState("true");

  const isErrorProject = projectName === "";
  const isErrorDomain = domain === "";
  const isErrorAccId = awsAccountId === "";
  const isErrorCluster = clusterName === "";

  const validateInputs = () => {
    if (
      projectName === "" ||
      domain === "" ||
      awsAccountId === "" ||
      clusterName === ""
    ) {
      return true;
    } else {
      return false;
    }
  };

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
        enableECK: enableECK,
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
        window.location.replace("../../");
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
      <FormControl>
        {!isContainerVisible && !generateInfrastructure && (
          <>
            <FormControl isInvalid={isErrorProject} isRequired>
              <FormLabel>Enter Project Name</FormLabel>
              <Input
                type="text"
                placeholder="example"
                onChange={(e) => {
                  setProjectName(e.target.value);
                }}
                value={projectName}
                style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
              />
              {!isErrorProject ? (
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
            <FormControl isInvalid={isErrorDomain} isRequired>
              <FormLabel>Enter your Domain Name</FormLabel>
              <Input
                type="text"
                placeholder="example.com"
                onChange={(e) => {
                  setDomain(e.target.value);
                }}
                value={domain}
                style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
              />
              {!isErrorDomain ? (
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
                <FormControl isInvalid={isErrorAccId} isRequired>
                  <FormLabel>Account ID</FormLabel>
                  <Input
                    type="number"
                    placeholder="123456789"
                    onChange={(e) => {
                      setAwsAccountId(e.target.value);
                    }}
                    value={awsAccountId}
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
                      Required
                    </FormErrorMessage>
                  )}
                </FormControl>
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
                <FormControl isInvalid={isErrorCluster} isRequired>
                  <FormLabel>Enter Cluster Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="demo-cluster"
                    onChange={(e) => {
                      setClusterName(e.target.value);
                    }}
                    value={clusterName}
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
                <FormLabel>Enable Elastic Cloud:</FormLabel>
                <Select
                  onChange={(e) => setEnableECK(e.target.value)}
                  value={enableECK}
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
          <>
            <Button
              onClick={handleSubmit}
              mt={4}
              border="2px"
              borderColor="green.500"
              width="100px"
              type="submit"
              isDisabled={validateInputs()}
            >
              Submit
            </Button>
            {validateInputs() ? (
              <p
                style={{
                  fontSize: "10px",
                  color: "red",
                  marginTop: "5px",
                  marginBottom: "20px",
                }}
              >
                Please ensure all the mandatory fields are filled
              </p>
            ) : (
              <p style={{ marginBottom: "20px" }}></p>
            )}
          </>
        )}
      </FormControl>

      {party && <Confetti width={width} height={height} />}
    </Container>
  );
}

export default FormWdi;
