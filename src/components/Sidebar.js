import React, { useState } from "react";
import db1 from "../assets/pstgrc.jpeg";
import db2 from "../assets/mongo.png";
import eurkea from "../assets/eureka.jpg";
import keycloak from "../assets/keycloak.png";
import istio from "../assets/istio.png";
import kafka from "../assets/kafka.png";
import pulsar from "../assets/pulsar.png";
import rabbitmq from "../assets/rabbitmq.png";
import azure from "../assets/Azure.png";
import aws from "../assets/aws.png";
import eck from "../assets/eck.png";
import mini from "../assets/mini.jpeg";
import docker from "../assets/docker.png";
import "./../App.css";
import {
  Input,
  FormLabel,
  Button,
  Flex,
  Spinner,
  Checkbox,
} from "@chakra-ui/react";

export default ({
  isUINodeEnabled,
  setIsUINodeEnabled,
  onSubmit,
  Service_Discovery_Data,
  authenticationData,
  isLoading,
  saveMetadata,
  Togglesave,
}) => {
  const onDragStart = (event, nodeType, Name) => {
    if (Name === "UI") {
      setIsUINodeEnabled(true);
    }
    event.dataTransfer.setData("Name", Name);
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const [selectedOption, setSelectedOption] = useState(null);

  const toggleOption = (option) => {
    setSelectedOption((prevOption) => (prevOption === option ? null : option));
  };
  const IntialState = {
    projectName: "",
  };

  const [projectData, setprojectData] = useState(IntialState);
  const [isEmpty, setIsEmpty] = useState(false);

  const handleData = (column, value) => {
    setIsEmpty(value === "");
    setprojectData((prev) => ({ ...prev, [column]: value }));
  };

  return (
    <aside style={{ position: "relative", overflow: "hidden", height: "88vh" }}>
      <FormLabel fontWeight="bold">Project Name</FormLabel>
      <Input
        mb={4}
        variant="outline"
        id="projectName"
        borderColor={"#CFCFCF"}
        value={projectData.projectName}
        onChange={(e) => handleData("projectName", e.target.value)}
      ></Input>

      <div className="description">
        <h2
          style={{
            cursor: "pointer",
            fontSize: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          You can drag these nodes to the pane on the left.
        </h2>
      </div>

      <div
        className={`dndnode output ${isUINodeEnabled ? "disabled" : ""}`}
        onDragStart={(event) => onDragStart(event, "default", "UI+Gateway")}
        draggable={!isUINodeEnabled}
        style={{
          backgroundColor: isUINodeEnabled ? "#CFCFCF" : "",
          cursor: isUINodeEnabled ? "not-allowed" : "",
        }}
      >
        UI+Gateway
      </div>

      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, "default", "Service")}
        draggable
      >
        Service
      </div>
      <h1
        style={{
          cursor: "pointer",
          fontSize: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onClick={() => toggleOption("Authentication")}
      >
        Authentication{" "}
        {selectedOption === "Authentication" ? (
          <span>&#x25B2;</span>
        ) : (
          <span>&#x25BC;</span>
        )}
      </h1>
      {selectedOption === "Authentication" && (
        <>
          <div
            className="selectorNode3"
            onDragStart={(event) =>
              onDragStart(event, "default", "Auth_oauth2")
            }
            draggable
          >
            <img width="145px" src={keycloak} alt="keycloaklogo"></img>
          </div>
        </>
      )}
      <h1
        style={{
          cursor: "pointer",
          fontSize: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onClick={() => toggleOption("Databases")}
      >
        Databases{" "}
        {selectedOption === "Databases" ? (
          <span>&#x25B2;</span>
        ) : (
          <span>&#x25BC;</span>
        )}
      </h1>
      {selectedOption === "Databases" && (
        <>
          <div
            className="selectorNode"
            onDragStart={(event) =>
              onDragStart(event, "default", "Database_postgresql")
            }
            draggable
          >
            <img width="120px" src={db1} alt="postgreslogo"></img>
          </div>

          <div
            className="selectorNode"
            onDragStart={(event) =>
              onDragStart(event, "default", "Database_mongodb")
            }
            draggable
          >
            <img width="120px" src={db2} alt="mongologo"></img>
          </div>
        </>
      )}

      <h1>
        <span
          style={{
            cursor: "pointer",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => toggleOption("serviceDiscovery")}
        >
          Service Discovery{" "}
          {selectedOption === "serviceDiscovery" ? (
            <span>&#x25B2;</span>
          ) : (
            <span>&#x25BC;</span>
          )}
        </span>
      </h1>
      {selectedOption === "serviceDiscovery" && (
        <>
          <div
            className="selectorNode1"
            onDragStart={(event) =>
              onDragStart(event, "default", "Discovery_eureka")
            }
            draggable
          >
            <img width="120px" src={eurkea} alt="eurekalogo"></img>
          </div>
        </>
      )}
      {/* <h1>
        <span
          style={{
            cursor: "pointer",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onClick={() => toggleOption("messageBroker")}
        >
          Message Broker{" "}
          {selectedOption === "messageBroker" ? (
            <span>&#x25B2;</span>
          ) : (
            <span>&#x25BC;</span>
          )}
        </span>
      </h1>
      {selectedOption === "messageBroker" && (
        <>
          <div
            className="selectorNode4"
            onDragStart={(event) =>
              onDragStart(event, "default", "MessageBroker_RabbitMQ")
            }
            draggable
          >
            <img width="120px" src={rabbitmq} alt="rabbitmqlogo" />
          </div>

          <div
            className="selectorNode4"
            onDragStart={(event) =>
              onDragStart(event, "default", "MessageBroker_Kafka")
            }
            draggable
          >
            <img width="120px" src={kafka} alt="kafkalogo" />
          </div>

          <div
            className="selectorNode4"
            onDragStart={(event) =>
              onDragStart(event, "default", "MessageBroker_Pulsar")
            }
            draggable
          >
            <img width="120px" src={pulsar} alt="pulsarlogo" />
          </div>
        </>
      )} */}

      <h1>
        <span
          style={{
            cursor: "pointer",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onClick={() => toggleOption("cloudProvider")}
        >
          Cloud Provider{" "}
          {selectedOption === "cloudProvider" ? (
            <span>&#x25B2;</span>
          ) : (
            <span>&#x25BC;</span>
          )}
        </span>
      </h1>
      {selectedOption === "cloudProvider" && (
        <>
          <div
            className="selectorNode5"
            onDragStart={(event) =>
              onDragStart(event, "default", "Cloud_azure")
            }
            draggable
          >
            <img width="120px" src={azure} alt="azurelogo" />
          </div>

          <div
            className="selectorNode5"
            onDragStart={(event) => onDragStart(event, "default", "Cloud_aws")}
            draggable
          >
            <img width="120px" src={aws} alt="awslogo" />
          </div>
        </>
      )}
      <h1>
        <span
          style={{
            cursor: "pointer",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onClick={() => toggleOption("loadManagement")}
        >
          Log Management{" "}
          {selectedOption === "loadManagement" ? (
            <span>&#x25B2;</span>
          ) : (
            <span>&#x25BC;</span>
          )}
        </span>
      </h1>
      {selectedOption === "loadManagement" && (
        <>
          <div
            className="selectorNode6"
            onDragStart={(event) => onDragStart(event, "default", "Load_eck")}
            draggable
          >
            <img width="120px" src={eck} alt="ecklogo" />
          </div>
        </>
      )}
      <h1>
        <span
          style={{
            cursor: "pointer",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onClick={() => toggleOption("Localenvironment")}
        >
          Localenvironment{" "}
          {selectedOption === "Localenvironment" ? (
            <span>&#x25B2;</span>
          ) : (
            <span>&#x25BC;</span>
          )}
        </span>
      </h1>
      {selectedOption === "Localenvironment" && (
        <>
          <div
            className="selectorNode7"
            onDragStart={(event) =>
              onDragStart(event, "default", "Localenvironment_minikube")
            }
            draggable
          >
            <img width="120px" src={mini} alt="minikubelogo" />
          </div>

          <div
            className="selectorNode7"
            onDragStart={(event) =>
              onDragStart(event, "default", "Localenvironment_docker")
            }
            draggable
          >
            <img width="120px" src={docker} alt="dockerlogo" />
          </div>
        </>
      )}
      <div
        style={{
          position: "absolute",
          marginTop: "auto",
          marginBottom: "10px",
          bottom: "0",
        }}
      >
        <div>
            <Checkbox
              size="md"
              colorScheme="blue"
              isChecked={saveMetadata}
              onChange={Togglesave}
            >
              Save Metadata
            </Checkbox>
          <Button
            onClick={() => {
              onSubmit(projectData) || isLoading(true);
            }}
            mt={4}
            border="2px"
            borderColor="green.500"
            width="100px"
            type="submit"
            isDisabled={
              !Service_Discovery_Data ||
              // !authenticationData ||
              isEmpty ||
              projectData.projectName === ""
            }
          >
            Submit
          </Button>
        </div>
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
        {isEmpty || projectData.projectName === "" ? (
          <p
            style={{
              fontSize: "10px",
              color: "red",
              // paddingBottom: "5px",
              marginTop: "5px",
            }}
          >
            Please enter Project Name
          </p>
        ) : (
          <p style={{ marginBottom: "5px" }}></p>
        )}
        {!authenticationData ? (
          <p
            style={{
              fontSize: "10px",
              color: "red",
              marginTop: "5px",
            }}
          >
            Please select Authentication type
          </p>
        ) : (
          <p style={{ marginBottom: "5px" }}></p>
        )}
        {!Service_Discovery_Data ? (
          <p
            style={{
              fontSize: "10px",
              color: "red",
              marginTop: "5px",
            }}
          >
            Please select Service Discovery type
          </p>
        ) : (
          <></>
          // <p style={{ marginBottom: "5px" }}></p>
        )}
      </div>
    </aside>
  );
};
