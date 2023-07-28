import React, { useState } from "react";
import db1 from "../assets/pstgrc.jpeg";
import db2 from "../assets/mongo.png";
import eurkea from "../assets/eureka.jpg";
import keycloakIcon from "../assets/keycloak.png";
import eck from "../assets/eck.png";
// import mini from "../assets/mini.jpeg";
// import docker from "../assets/docker.png";
import "./../App.css";
import { Input, FormLabel, Button, Checkbox } from "@chakra-ui/react";
import DeployModal from "./Modal/DeployModal";
import { useKeycloak } from "@react-keycloak/web";

const Sidebar = ({
  isUINodeEnabled,
  Service_Discovery_Data,
  onSubmit,
  authenticationData,
  isLoading,
  saveMetadata,
  Togglesave,
  nodes,
  isEmptyUiSubmit,
  isEmptyServiceSubmit,
  selectedColor,
  handleColorClick,
}) => {
  const onDragStart = (event, nodeType, Name) => {
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

  const handleProjectData = (column, value) => {
    setprojectData((prev) => ({ ...prev, [column]: value }));
  };
  const [showModal, setShowModal] = useState(false);
  const { initialized, keycloak } = useKeycloak();

  const handleButtonClick = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const checkNodeExists =
    nodes?.UI ||
    Object.values(nodes).some((node) => node.id.startsWith("Service"));

  const projectNameCheck = !/^[a-zA-Z](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$/g.test(
    projectData.projectName
  );
  return (
    <>
      <aside
        style={{
          position: "relative",
          overflow: "hidden",
          height: "94vh",
          border: "1px Solid #CFCFCF",
          backgroundColor: "#f7f7f7",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          class="sideBlock"
          style={{
            position: "relative",
            flex: "1",
            overflowY: "auto",
          }}
        >
          <FormLabel fontWeight="bold">Project Name</FormLabel>
          <Input
            mb={1}
            variant="outline"
            id="projectName"
            borderColor={
              !projectData.projectName || projectNameCheck ? "red" : "#CFCFCF"
            }
            maxLength="32"
            value={projectData.projectName}
            onChange={(e) => handleProjectData("projectName", e.target.value)}
          ></Input>
          {projectData.projectName && projectNameCheck && (
            <span style={{ color: "red", fontSize: "10px" }}>
              Enter a valid project name
            </span>
          )}

          <div className="description">
            <h2
              style={{
                marginTop: "8px",
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
          <div
            className="dndnode output"
            onDragStart={(event) => onDragStart(event, "default", "Group")}
            draggable
          >
            Group
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
                <img width="145px" src={keycloakIcon} alt="keycloaklogo"></img>
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
                <img
                  width="120px"
                  style={{ marginBottom: "10px" }}
                  src={db1}
                  alt="postgreslogo"
                ></img>
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
                onDragStart={(event) =>
                  onDragStart(event, "default", "Load_eck")
                }
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
        </div>
        <div
          style={{
            position: "sticky",
            bottom: "0",
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
              gap: "15px",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                border:
                  selectedColor === "#ffc9c9"
                    ? "2px solid black"
                    : "1px solid transparent",
                borderRadius: "50%",
                backgroundColor: "#ffc9c9",
                cursor: "pointer",
              }}
              onClick={() => handleColorClick("#ffc9c9")}
            ></div>
            <div
              style={{
                width: "30px",
                height: "30px",
                border:
                  selectedColor === "#b2f2bb"
                    ? "2px solid black"
                    : "1px solid transparent",
                borderRadius: "50%",
                backgroundColor: "#b2f2bb",
                cursor: "pointer",
              }}
              onClick={() => handleColorClick("#b2f2bb")}
            ></div>
            <div
              style={{
                width: "30px",
                height: "30px",
                border:
                  selectedColor === "#a5d8ff"
                    ? "2px solid black"
                    : "1px solid transparent",
                borderRadius: "50%",
                backgroundColor: "#a5d8ff",
                cursor: "pointer",
              }}
              onClick={() => handleColorClick("#a5d8ff")}
            ></div>
            <div
              style={{
                width: "30px",
                height: "30px",
                border:
                  selectedColor === "#ffec99"
                    ? "2px solid black"
                    : "1px solid transparent",
                borderRadius: "50%",
                backgroundColor: "#ffec99",
                cursor: "pointer",
              }}
              onClick={() => handleColorClick("#ffec99")}
            ></div>
            <div
              style={{
                width: "30px",
                height: "30px",
                border:
                  selectedColor === "#fff"
                    ? "2px solid black"
                    : "1px solid #cfcfcf",
                borderRadius: "50%",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}
              onClick={() => handleColorClick("#fff")}
            ></div>
          </div>
          {initialized && keycloak.authenticated && (
            <Checkbox
              size="md"
              colorScheme="blue"
              isChecked={saveMetadata}
              onChange={Togglesave}
            >
              Save Project
            </Checkbox>
          )}
          {/* <div style={{ display:'flex', justifyContent:'center'}}> */}
          <Button
            onClick={handleButtonClick}
            mt={4}
            border="2px"
            borderColor="#3182CE"
            width="100px"
            type="submit"
            isDisabled={
              !checkNodeExists ||
              !authenticationData ||
              projectNameCheck ||
              projectData.projectName === "" ||
              isEmptyUiSubmit === true ||
              isEmptyServiceSubmit === true
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

          {!checkNodeExists ? (
            <p
              style={{
                fontSize: "10px",
                color: "red",
                marginTop: "5px",
              }}
            >
              Please ensure there exists atleast one application
            </p>
          ) : (
            <></>
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
            <></>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
