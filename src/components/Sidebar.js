import React, { useState } from "react";
import db1 from "../assets/pstgrc.jpeg";
import db2 from "../assets/mongo.png";
import eurkea from "../assets/eureka.jpg";
import keycloak from "../assets/keycloak.png";
import eck from "../assets/eck.png";
import mini from "../assets/mini.jpeg";
import docker from "../assets/docker.png";
import "./../App.css";
import { Input, FormLabel, Button, Checkbox } from "@chakra-ui/react";
import DeployModal from "./Modal/DeployModal";

export default ({
  isUINodeEnabled,
  setIsUINodeEnabled,
  Service_Discovery_Data,
  onSubmit,
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

  const handleProjectData = (column, value) => {
    setIsEmpty(value === "");
    setprojectData((prev) => ({ ...prev, [column]: value }));
  };
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <aside
        style={{
          position: "relative",
          overflow: "hidden",
          height: "88vh",
          border: "1px Solid #CFCFCF",
          backgroundColor: "#f7f7f7",
        }}
      >
        <FormLabel fontWeight="bold">Project Name</FormLabel>
        <Input
          mb={4}
          variant="outline"
          id="projectName"
          borderColor={"#CFCFCF"}
          value={projectData.projectName}
          onChange={(e) => handleProjectData("projectName", e.target.value)}
        ></Input>

        <div className="description">
          <h2
            style={{
              cursor: "pointer",
              fontSize: "12px",
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
          onClick={() => toggleOption("Database")}
        >
          Database{" "}
          {selectedOption === "Databases" ? (
            <span>&#x25B2;</span>
          ) : (
            <span>&#x25BC;</span>
          )}
        </h1>
        {selectedOption === "Database" && (
          <>
            <div
              className="selectorNode"
              onDragStart={(event) =>
                onDragStart(event, "default", "Database_postgresql")
              }
              draggable
            >
              <img width="120px" style={{marginBottom:'10px'}} src={db1} alt="postgreslogo"></img>
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
        {/* <h1>
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
        )} */}
        <div
          style={{
            position: "absolute",
            marginTop: "auto",
            marginBottom: "10px",
            bottom: "0",
            display:'flex',
            flexDirection:'column'
          }}
        >
          <Checkbox
            size="md"
            colorScheme="blue"
            isChecked={saveMetadata}
            onChange={Togglesave}
          >
            Save Project
          </Checkbox>
          {/* <div style={{ display:'flex', justifyContent:'center'}}> */}
          <Button
            onClick={handleButtonClick}
            mt={4}
            border="2px"
            borderColor="#3182CE"
            width="100px"
            type="submit"
            isDisabled={
              !authenticationData || isEmpty || projectData.projectName === ""
            }
          >
            Next
          </Button>
          {showModal && (
            <DeployModal
              onSubmit={onSubmit}
              isLoading={isLoading}
              projectData={projectData}
              onClose={handleCloseModal}
              Service_Discovery_Data={Service_Discovery_Data}
            />
          )}

          {isEmpty || projectData.projectName === "" ? (
            <p
              style={{
                fontSize: "10px",
                color: "red",
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
        </div>
      </aside>
    </>
  );
};
