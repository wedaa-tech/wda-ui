import React, { useState, useEffect } from "react";
import {
  Accordion,
  Container,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Checkbox,
  CloseButton,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { AddIcon } from "@chakra-ui/icons";
import Application from "./Application";
// import Entity from "./Entity";
import Deployment from "./Deployment";
import { saveAs } from "file-saver";
import Confetti from "react-confetti";
import useWindowDimensions from "../../Hooks/useWindowDimensions";
import {
  entityPreFlightTemplate,
  applicationPreFlightTemplate,
  communicationPreFlightTemplate,
  deploymentPreFlightTemplate,
  wdiPreFlightTemplate,
} from "./assert";
import Communication from "./Communication";
import Infrastructure from "./Infrastructure";

function FormWda() {
  const { height, width } = useWindowDimensions();
  const [party, setParty] = useState(false);

  const [entityCounter, setEntityCounter] = useState(1);
  const [communicationCounter, setCommunicationCounter] = useState(1);
  const [entity, setEntity] = useState([entityPreFlightTemplate]);
  const [applicationCounter, setApplicationCounter] = useState(1);
  const [application, setApplication] = useState({
    0: applicationPreFlightTemplate,
  });
  const [deployment, setDeployment] = useState(deploymentPreFlightTemplate);
  const [communication, setCommunication] = useState({
    0: communicationPreFlightTemplate,
  });
  const [wdi, setWdi] = useState(wdiPreFlightTemplate);
  const [isOpen, setIsOpen] = useState(true);
  const [isContainerVisible, setIsContainerVisible] = useState(true);
  const [generateInfrastructure, setGenerateInfrastructure] = useState(false);
  const [username, setUsername] = useState("");
  const [projectName, setProjectName] = useState("");
  const [applicationNames, setApplicationNames] = useState([]);
  const [isDuplicateAppName, setIsDuplicateAppName] = useState(false);
  const [checkLength, setCheckLength] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (party) {
      setTimeout(() => {
        setParty(false);
      }, 5000);
    }
  }, [party]);

  const handleContainerClose = () => {
    setIsOpen(false);
    setIsContainerVisible(false);
  };
  const handleCheckboxChange = (e) => {
    setGenerateInfrastructure(e.target.checked);
  };
  const addEntity = () => {
    setEntityCounter((state) => state + 1);
    setEntity((prev) => ({
      ...prev,
      [entityCounter]: entityPreFlightTemplate,
    }));
  };
  const addApplication = () => {
    setApplicationCounter((state) => state + 1);
    setApplication((prev) => ({
      ...prev,
      [applicationCounter]: applicationPreFlightTemplate,
    }));
    setApplicationNames((prev) => [...prev, ""]);
  };
  const addCommunication = () => {
    setCommunicationCounter((state) => state + 1);
    setCommunication((prev) => ({
      ...prev,
      [communicationCounter]: communicationPreFlightTemplate,
    }));
  };
  const checkDuplicateAppName = (id, field, value) => {
    if (field === "applicationName") {
      const isDuplicate = applicationNames.some(
        (name, i) => name === value.trim() && i !== id
      );
      setIsDuplicateAppName(isDuplicate);
      setApplicationNames((names) => {
        const newNames = [...names];
        newNames[id] = value.trim();
        return newNames;
      });
    }
  };
  const validateApplication = () => {
    let invalidInput = false;
    Object.values(application).forEach((app) => {
      if (
        app.applicationName === "" ||
        // isDuplicateAppName ||
        app.packageName === "" ||
        app.serverPort === ""
      ) {
        invalidInput = true;
      }
    });
    if (invalidInput) {
      return true;
    } else {
      return false;
    }
  };
  // Object.values(communication).forEach((comm) => {
  //   if (comm.clientName === "" || comm.serverName === "") {
  //     invalidInput = true;
  //   }
  // });
  const validateDeployment = () => {
    if (
      deployment.dockerRepositoryName === "" ||
      deployment.kubernetesNamespace === "" ||
      deployment.kubernetesStorageClassName === "" ||
      deployment.ingressDomain === ""
    ) {
      return true;
    }
    return false;
  };
  const validateInputValue = (field, value) => {
    if (field === "awsAccountId" && value.length < 12) {
      setCheckLength(true);
    } else {
      setCheckLength(false);
    }
  };
  const validateInfra = () => {
    if (
      wdi.domain === "" ||
      wdi.awsAccountId === "" ||
      wdi.clusterName === ""
    ) {
      return true;
    } else {
      return false;
    }
  };
  const handleSubmitWda = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch(
      process.env.REACT_APP_API_BASE_URL +
        "/generateJDL?username=" +
        username +
        "&projectName=" +
        projectName +
        "&generateInfra=" +
        generateInfrastructure +
        "",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          application,
          entity,
          deployment,
          communication,
        }),
      }
    )
      .then((response) => response.blob())
      .then((blob) => {
        setIsLoading(false);
        saveAs(blob, `${projectName}.zip`); // Edit the name or ask the user for the project Name
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setTimeout(() => setParty(true));
        window.location.replace("../../");
      });
  };

  const handleSubmitWdi = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch(
      process.env.REACT_APP_API_BASE_URL +
        "/generateJDL?username=" +
        username +
        "&projectName=" +
        projectName +
        "&generateInfra=" +
        generateInfrastructure +
        "",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          application,
          entity,
          deployment,
          communication,
          wdi,
        }),
      }
    )
      .then((response) => response.blob())
      .then((blob) => {
        setIsLoading(false);
        saveAs(blob, `${projectName}.zip`);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setTimeout(() => setParty(true));
        window.location.replace("../../");
      });
  };

  return (
    <>
      <Modal isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2 style={{ display: "inline-block" }}>
              Please enter your details
            </h2>
            <span style={{ float: "right" }}>
              <Link to="/">
                <CloseButton style={{ background: "none" }} />
              </Link>
            </span>
          </ModalHeader>
          <ModalBody>
            Enter username
            <Input
              type="text"
              marginBottom="10px"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            Enter project name
            <Input
              type="text"
              marginBottom="10px"
              onChange={(e) => setProjectName(e.target.value)}
              value={projectName}
            />
            <Checkbox
              defaultChecked={generateInfrastructure}
              onChange={handleCheckboxChange}
            >
              Generate infrastructure
            </Checkbox>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleContainerClose}
              isDisabled={!username || !projectName}
            >
              Next
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {!isContainerVisible && (
        <Container maxW="2xl" marginTop="16px">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Heading marginBottom="10px" marginRight="10px">
              WDA
            </Heading>
            {generateInfrastructure && (
              <Heading marginBottom="10px">& WDI</Heading>
            )}
          </div>
          <Tabs isLazy isFitted>
            <TabList mb="1em">
              {/* <Tab
                fontWeight="normal"
                _selected={{
                  fontWeight: "bold",
                  color: "rgb(49, 130, 206)",
                  borderBottom: "2px solid rgb(49, 130, 206)",
                }}
              >
                Entity
              </Tab> */}
              <Tab
                fontWeight="normal"
                _selected={{
                  fontWeight: "bold",
                  color: "rgb(49, 130, 206)",
                  borderBottom: "2px solid rgb(49, 130, 206)",
                }}
              >
                Application
              </Tab>
              <Tab
                fontWeight="normal"
                _selected={{
                  fontWeight: "bold",
                  color: "rgb(49, 130, 206)",
                  borderBottom: "2px solid rgb(49, 130, 206)",
                }}
              >
                Communication
              </Tab>
              <Tab
                fontWeight="normal"
                _selected={{
                  fontWeight: "bold",
                  color: "rgb(49, 130, 206)",
                  borderBottom: "2px solid rgb(49, 130, 206)",
                }}
              >
                Deployment
              </Tab>
              {generateInfrastructure && (
                <Tab
                  fontWeight="normal"
                  _selected={{
                    fontWeight: "bold",
                    color: "rgb(49, 130, 206)",
                    borderBottom: "2px solid rgb(49, 130, 206)",
                  }}
                >
                  Infrastructure
                </Tab>
              )}
              {/* <Tab>Code</Tab> */}
            </TabList>
            <TabPanels>
              {/* <TabPanel>
                <Accordion allowToggle>
                  {Object.values(entity).map((entity, id) => {
                    return (
                      <Entity
                        key={id}
                        id={id}
                        setEntity={setEntity}
                        entity={entity}
                      />
                    );
                  })}
                </Accordion>
                <Button
                  width="100px"
                  border="2px"
                  borderColor="green.500"
                  mr={4}
                  leftIcon={<AddIcon />}
                  onClick={addEntity}
                  marginTop="10px"
                >
                  Add
                </Button>
              </TabPanel> */}
              <TabPanel>
                <Accordion allowToggle>
                  {Object.values(application).map((application, id) => {
                    return (
                      <Application
                        key={id}
                        id={id}
                        application={application}
                        setApplication={setApplication}
                        checkDuplicateAppName={checkDuplicateAppName}
                        isDuplicateAppName={isDuplicateAppName}
                        // entity={entity}
                        // Client
                        // Name
                      />
                    );
                  })}
                  <Button
                    width="100px"
                    border="2px"
                    borderColor="green.500"
                    onClick={addApplication}
                    leftIcon={<AddIcon />}
                    marginTop="10px"
                  >
                    Add
                  </Button>
                </Accordion>
              </TabPanel>
              <TabPanel>
                <Accordion allowToggle>
                  {Object.values(communication).map((communication, id) => {
                    return (
                      <Communication
                        key={id}
                        id={id}
                        application={application}
                        communication={communication}
                        setCommunication={setCommunication}
                      />
                    );
                  })}
                </Accordion>
                {Object.values(application).filter(
                  (app) => app.applicationName !== ""
                ).length >= 2 && (
                  <Button
                    width="100px"
                    border="2px"
                    borderColor="green.500"
                    mr={4}
                    leftIcon={<AddIcon />}
                    onClick={addCommunication}
                    marginTop="10px"
                  >
                    Add
                  </Button>
                )}
              </TabPanel>
              <TabPanel>
                <Deployment
                  application={application}
                  deployment={deployment}
                  setDeployment={setDeployment}
                />
                {!generateInfrastructure && (
                  <>
                    <Button
                      width="100px"
                      border="2px"
                      borderColor="green.500"
                      onClick={handleSubmitWda || isLoading(true)}
                      marginTop="10px"
                      isDisabled={
                        isDuplicateAppName ||
                        validateApplication() ||
                        validateDeployment()
                      }
                    >
                      Submit
                    </Button>
                    {isLoading && (
                      <Flex
                        position="fixed"
                        top="0"
                        left="0"
                        right="0"
                        bottom="0"
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor="rgba(240, 248, 255, 0.5)" // Use RGBA to set opacity
                        zIndex="9999"
                        display="flex"
                        flexDirection="column"
                      >
                        <Spinner
                          thickness="8px"
                          speed="0.9s"
                          emptyColor="gray.200"
                          color="#3182CE"
                          height="250px"
                          width="250px"
                        />
                        <div
                          style={{
                            marginTop: "40px",
                            color: "#3182CE",
                            fontWeight: "bolder",
                            fontSize: "20px",
                          }}
                        >
                          Please wait while we generate your project
                        </div>
                      </Flex>
                    )}
                    {isDuplicateAppName ? (
                      <p
                        style={{
                          fontSize: "10px",
                          color: "red",
                          marginTop: "5px",
                        }}
                      >
                        Please ensure Application names are unique
                      </p>
                    ) : null}
                    {validateApplication() ? (
                      <p
                        style={{
                          fontSize: "10px",
                          color: "red",
                          marginTop: "5px",
                        }}
                      >
                        Please ensure all the mandatory fields in Application
                        are filled
                      </p>
                    ) : null}
                    {validateDeployment() ? (
                      <p
                        style={{
                          fontSize: "10px",
                          color: "red",
                          marginTop: "5px",
                        }}
                      >
                        Please ensure all the mandatory fields in Deployment are
                        filled
                      </p>
                    ) : null}
                  </>
                )}
              </TabPanel>
              {generateInfrastructure && (
                <TabPanel>
                  <Infrastructure
                    application={application}
                    wdi={wdi}
                    setWdi={setWdi}
                    checkLength={checkLength}
                    validateInputValue={validateInputValue}
                  />
                  <Button
                    width="100px"
                    border="2px"
                    borderColor="green.500"
                    onClick={handleSubmitWdi || isLoading(true)}
                    marginTop="10px"
                    isDisabled={
                      isDuplicateAppName ||
                      validateApplication() ||
                      validateDeployment() ||
                      checkLength ||
                      validateInfra() 
                    }
                  >
                    Submit
                  </Button>
                  {isLoading && (
                    <Flex
                      position="fixed"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor="rgba(240, 248, 255, 0.5)" // Use RGBA to set opacity
                      zIndex="9999"
                      display="flex"
                      flexDirection="column"
                    >
                      <Spinner
                        thickness="8px"
                        speed="0.9s"
                        emptyColor="gray.200"
                        color="#3182CE"
                        height="250px"
                        width="250px"
                      />
                      <div
                        style={{
                          marginTop: "40px",
                          color: "#3182CE",
                          fontWeight: "bolder",
                          fontSize: "20px",
                        }}
                      >
                        Please wait while we generate your project
                      </div>
                    </Flex>
                  )}
                  {isDuplicateAppName ? (
                    <p
                      style={{
                        fontSize: "10px",
                        color: "red",
                        marginTop: "5px",
                      }}
                    >
                      Please ensure Application names are unique
                    </p>
                  ) : null}
                  {validateApplication() ? (
                    <p
                      style={{
                        fontSize: "10px",
                        color: "red",
                        marginTop: "5px",
                      }}
                    >
                      Please ensure all the mandatory fields in Application are
                      filled
                    </p>
                  ) : null}
                  {validateDeployment() ? (
                    <p
                      style={{
                        fontSize: "10px",
                        color: "red",
                        marginTop: "5px",
                      }}
                    >
                      Please ensure all the mandatory fields in Deployment are
                      filled
                    </p>
                  ) : null}
                  {checkLength ? (
                    <p
                      style={{
                        fontSize: "10px",
                        color: "red",
                        marginTop: "5px",
                      }}
                    >
                      Please ensure you have entered correct AWS Account ID
                    </p>
                  ) : null}
                  {validateInfra() ? (
                    <p
                      style={{
                        fontSize: "10px",
                        color: "red",
                        marginTop: "5px",
                      }}
                    >
                      Please ensure all the mandatory fields in Infrastruture
                      are filled
                    </p>
                  ) : null}
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>

          {party && <Confetti width={width} height={height} />}
        </Container>
      )}
    </>
  );
}

export default FormWda;
