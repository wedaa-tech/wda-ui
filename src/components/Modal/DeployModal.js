import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom'; 
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  Button,
  FormLabel,
  FormControl,
  Alert,
  AlertIcon,
  Flex,
  Spinner,
  ModalCloseButton,
  Tooltip,
} from "@chakra-ui/react";
import azure from "../../../src/assets/Azure.png";
import aws from "../../../src/assets/aws.png";
import { InfoIcon } from "@chakra-ui/icons";
// import minikube from "../../assets/mini.png";

const DeployModal = ({ onSubmit, isLoading, projectData, onClose, update }) => {
  const location = useLocation();
  const [userData, setuserData] = useState(location?.state);
  const [selectedImage, setSelectedImage] = useState(null);
  const [checkLength, setCheckLength] = useState(false);
  const [DeploymentData, setDeploymentData] = useState({});

  useEffect(() => {
    if (update && userData && userData.metadata?.deployment) {
      setSelectedImage(userData.metadata.deployment.cloudProvider);
      setDeploymentData(userData.metadata.deployment);
    }
  }, [userData, location?.state]);

  const isCheckEmpty = () => {
    if (DeploymentData.cloudProvider === "azure") {
      return (
        DeploymentData.deploymentType === "" ||
        DeploymentData.clusterName === "" ||
        DeploymentData.kubernetesNamespace === "" ||
        DeploymentData.monitoring === "" ||
        // DeploymentData.ingressDomain === "" ||
        DeploymentData.k8sWebUI === ""
      );
    } else if (DeploymentData.cloudProvider === "aws") {
      if (DeploymentData.kubernetesUseDynamicStorage === "true") {
        return (
          DeploymentData.kubernetesStorageClassName === "" ||
          DeploymentData.awsAccountId === "" ||
          DeploymentData.awsRegion === "" ||
          DeploymentData.deploymentType === "" ||
          DeploymentData.clusterName === "" ||
          DeploymentData.kubernetesNamespace === "" ||
          DeploymentData.monitoring === "" ||
          DeploymentData.k8sWebUI === ""
        );
      }
      return (
        DeploymentData.awsAccountId === "" ||
        DeploymentData.awsRegion === "" ||
        DeploymentData.deploymentType === "" ||
        DeploymentData.clusterName === "" ||
        DeploymentData.kubernetesNamespace === "" ||
        DeploymentData.monitoring === "" ||
        // DeploymentData.ingressDomain === "" ||
        DeploymentData.k8sWebUI === ""
      );
    } else {
      return (
        DeploymentData.dockerRepositoryName === "" ||
        DeploymentData.kubernetesNamespace === "" ||
        DeploymentData.monitoring === ""
      );
    }
  };

  const forbiddenWords = [
    "admin",
    "adfs",
    "adsync",
    "api",
    "appgateway",
    "appservice",
    "archive",
    "arm",
    "automation",
    "autoscale",
    "az",
    "azure",
    "batch",
    "bing",
    "biztalk",
    "bot",
    "cdn",
    "cloud",
    "container",
    "cosmos",
    "data",
    "dev",
    "diagnostics",
    "dns",
    "documentdb",
    "edge",
    "eventhub",
    "express",
    "fabric",
    "frontdoor",
    "gateway",
    "graph",
    "hana",
    "health",
    "host",
    "hybrid",
    "insight",
    "iot",
    "keyvault",
    "lab",
    "machinelearning",
    "management",
    "market",
    "media",
    "mobile",
    "ms",
    "msit",
    "my",
    "mysql",
    "network",
    "notification",
    "oms",
    "orchestration",
    "portal",
    "recovery",
    "redis",
    "scheduling",
    "search",
    "server",
    "service",
    "shop",
    "sql",
    "stack",
    "storage",
    "store",
    "stream",
    "support",
    "syndication",
    "trafficmanager",
    "user",
    "virtualnetwork",
    "visualstudio",
    "vm",
    "vpn",
    "vsts",
    "web",
    "webservices",
    "worker",
  ];

  const azureClusterNameCheck =
    DeploymentData.cloudProvider === "azure" &&
    forbiddenWords.includes(DeploymentData.clusterName);

  const handleImageClick = (image) => {
    setSelectedImage(image);

    let ProviderStates;
    if (image === "aws") {
      ProviderStates = {
        awsAccountId: "",
        awsRegion: "",
        kubernetesStorageClassName: "",
      };
    } else if (image === "azure") {
      ProviderStates = {
        location: "canadacentral",
        subscriptionId: "",
        tenantId: "",
      };
    } else if (image === "minikube") {
      ProviderStates = {
        dockerRepositoryName: "",
      };
    }
    ProviderStates = {
      ...ProviderStates,
      deploymentType: "",
      enableECK: "false",
      clusterName: "",
      kubernetesUseDynamicStorage: "true",
      kubernetesNamespace: "",
      ingressType: "istio",
      monitoring: "",
      ingressDomain: "",
      k8sWebUI: "",
    };

    setDeploymentData((prevState) => ({
      ...prevState,
      cloudProvider: image,
      ...ProviderStates,
    }));
  };

  const handleKeyPress = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || charCode === 8) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  };

  const handleBlur = (column, value) => {
    if (column === "awsAccountId") validateInputValue(value);
    else if (column === "tenantId") {
      validateAzureInputValue("tenantId", value);
    } else if (column === "subscriptionId") {
      validateAzureInputValue("subscriptionId", value);
    }
  };
  const handleData = (column, value) => {
    setDeploymentData((prev) => ({ ...prev, [column]: value }));
  };
  const namespaceCheck = /^[a-zA-Z][a-zA-Z0-9-]*$/.test(
    DeploymentData.kubernetesNamespace
  );
  const clusterNameCheck = /^[a-zA-Z][a-zA-Z0-9-]*$/.test(
    DeploymentData.clusterName
  );
  const storageClassCheck = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(
    DeploymentData.kubernetesStorageClassName
  );

  let domainNameCheck = true;
  if (DeploymentData.ingressDomain !== "") {
    domainNameCheck = /^(?!:\/\/)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/.test(
      DeploymentData.ingressDomain
    );
  }

  const checkValidation = () => {
    if (selectedImage === "minikube") return !namespaceCheck;
    else if (selectedImage === "aws") {
      if (DeploymentData.kubernetesUseDynamicStorage === "true")
        return (
          !storageClassCheck ||
          !namespaceCheck ||
          !domainNameCheck ||
          !clusterNameCheck
        );
      else {
        return !namespaceCheck || !domainNameCheck || !clusterNameCheck;
      }
    }
    return (
      !namespaceCheck ||
      !domainNameCheck ||
      !clusterNameCheck ||
      azureClusterNameCheck ||
      validateSubscriptionIdField ||
      validateTenantIdField
    );
  };
  const validateInputValue = (value) => {
    if (value.length < 12) {
      setCheckLength(true);
    } else setCheckLength(false);
  };
  const [validateSubscriptionIdField, setValidateSubscriptionIdField] =
    useState(false);
  const [validateTenantIdField, setValidateTenantIdField] = useState(false);

  const validateAzureInputValue = (column, value) => {
    const regexExp =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    let isValid = true;

    if (column === "tenantId") {
      const isValidLength = value.length === 36;
      const isValidFormat = regexExp.test(value);
      isValid = isValidLength && isValidFormat;
      setValidateTenantIdField(!isValid);
    } else if (column === "subscriptionId") {
      const isValidLength = value.length === 36;
      const isValidFormat = regexExp.test(value);
      isValid = isValidLength && isValidFormat;
      setValidateSubscriptionIdField(!isValid);
    }

    return isValid;
  };

  function handleSubmit(DeploymentData) {
    let FinalData = { ...DeploymentData };

    if (FinalData.cloudProvider === "aws") {
      delete FinalData?.location;
      delete FinalData?.subscriptionId;
      delete FinalData?.tenantId;
      delete FinalData?.dockerRepositoryName;
    } else if (FinalData.cloudProvider === "azure") {
      console.log("hloooooo");
      delete FinalData?.awsAccountId;
      delete FinalData?.awsRegion;
      delete FinalData?.kubernetesStorageClassName;
      delete FinalData?.dockerRepositoryName;
    } else {
      delete FinalData?.location;
      delete FinalData?.subscriptionId;
      delete FinalData?.tenantId;
      delete FinalData?.awsAccountId;
      delete FinalData?.awsRegion;
      delete FinalData?.kubernetesStorageClassName;
      delete FinalData?.deploymentType;
      delete FinalData?.clusterName;
      delete FinalData?.ingressDomain;
      delete FinalData?.k8sWebUI;
    }
    if (FinalData.kubernetesUseDynamicStorage === "false")
      delete FinalData?.kubernetesStorageClassName;
    if (selectedImage === "aws") {
      !checkLength && onSubmit({ ...projectData, deployment: FinalData });
    } else if (selectedImage === "azure") {
      const isAzureInputValid = validateAzureInputValue(
        "subscriptionId",
        FinalData.subscriptionId
      );
      const isAzureInputValidField = validateAzureInputValue(
        "tenantId",
        FinalData.tenantId
      );
      setValidateSubscriptionIdField(!isAzureInputValid);
      setValidateTenantIdField(!isAzureInputValidField);
      if (isAzureInputValid && isAzureInputValidField) {
        onSubmit({ ...projectData, deployment: FinalData });
      }
    } else {
      onSubmit({ ...projectData, deployment: FinalData });
    }
  }

  const [isOpen, setIsOpen] = useState(true);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
        // style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h2 style={{ display: "inline", marginRight: "10px" }}>
            Deployment Infrastructure
          </h2>
          <Tooltip
            hasArrow
            label="Select your infrastructure and provide required configuration"
            bg="gray.300"
            color="black"
            placement="bottom"
            width="250px"
          >
            <InfoIcon
              marginRight="20px"
              style={{ fontSize: "16px", color: "#a6a6a6" }}
            />
          </Tooltip>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody
          style={{
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
            maxHeight: "600px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <img
              width="120px"
              src={azure}
              alt="azurelogo"
              onClick={() => handleImageClick("azure")}
              style={{
                padding: "10px",
                marginBottom: "10px",
                width: "120px",
                cursor: "pointer",
                marginRight: "10px",
                border:
                  selectedImage === "azure"
                    ? "2px solid #3182CE"
                    : "2px solid #d9d9d9",
              }}
            />
            <img
              width="120px"
              src={aws}
              alt="awslogo"
              onClick={() => handleImageClick("aws")}
              style={{
                padding: "10px",
                marginBottom: "10px",
                width: "120px",
                marginRight: "10px",
                cursor: "pointer",
                border:
                  selectedImage === "aws"
                    ? "2px solid #3182CE"
                    : "2px solid #d9d9d9",
              }}
            />
            {/* <img
              width="170px"
              src={minikube}
              alt="minikubelogo"
              onClick={() => handleImageClick("minikube")}
              style={{
                padding: "10px",
                marginBottom: "10px",
                width: "120px",
                cursor: "pointer",
                border:
                  selectedImage === "minikube"
                    ? "2px solid #3182CE"
                    : "2px solid #d9d9d9",
              }}
            /> */}
          </div>
          {selectedImage === "azure" && (
            <div>
              <FormControl>
                <FormLabel>Subscription Id</FormLabel>
                <Input
                  mb={4}
                  variant="outline"
                  id="subscriptionId"
                  borderColor={"black"}
                  maxLength="36"
                  value={DeploymentData.subscriptionId}
                  onChange={(e) => handleData("subscriptionId", e.target.value)}
                  onBlur={(e) => handleBlur("subscriptionId", e.target.value)}
                ></Input>
              </FormControl>
              {validateSubscriptionIdField && (
                <>
                  {DeploymentData.subscriptionId.length < 36 ? (
                    <Alert
                      status="error"
                      height="12px"
                      fontSize="12px"
                      borderRadius="3px"
                      mb={2}
                    >
                      <AlertIcon style={{ width: "14px", height: "14px" }} />
                      Input value must be at least 36 characters
                    </Alert>
                  ) : (
                    <Alert
                      status="error"
                      height="12px"
                      fontSize="12px"
                      borderRadius="3px"
                      mb={2}
                    >
                      <AlertIcon style={{ width: "14px", height: "14px" }} />
                      Input value does not match the required format
                    </Alert>
                  )}
                </>
              )}
              <FormControl>
                <FormLabel>Tenant ID</FormLabel>
                <Input
                  mb={4}
                  variant="outline"
                  id="tenantId"
                  borderColor={"black"}
                  maxLength="36"
                  value={DeploymentData.tenantId}
                  onChange={(e) => handleData("tenantId", e.target.value)}
                  onBlur={(e) => handleBlur("tenantId", e.target.value)}
                ></Input>
              </FormControl>
              {validateTenantIdField && (
                <>
                  {DeploymentData.tenantId.length < 36 ? (
                    <Alert
                      status="error"
                      height="12px"
                      fontSize="12px"
                      borderRadius="3px"
                      mb={2}
                    >
                      <AlertIcon style={{ width: "14px", height: "14px" }} />
                      Input value must be at least 36 characters
                    </Alert>
                  ) : (
                    <Alert
                      status="error"
                      height="12px"
                      fontSize="12px"
                      borderRadius="3px"
                      mb={2}
                    >
                      <AlertIcon style={{ width: "14px", height: "14px" }} />
                      Input value does not match the required format
                    </Alert>
                  )}
                </>
              )}
              <FormControl>
                <FormLabel>Location</FormLabel>
                <Select
                  mb={4}
                  variant="outline"
                  id="location"
                  borderColor={"black"}
                  value={DeploymentData.location}
                  onChange={(e) => handleData("location", e.target.value)}
                >
                  <option value="canadacentral">Canada Central</option>
                </Select>
              </FormControl>
            </div>
          )}
          {selectedImage === "aws" && (
            <div>
              <FormControl>
                <FormLabel>AWS Account ID</FormLabel>
                <Input
                  mb={4}
                  variant="outline"
                  type="text"
                  placeholder="123456789"
                  id="awsAccountId"
                  onKeyPress={handleKeyPress}
                  maxLength="12"
                  borderColor={"black"}
                  value={DeploymentData.awsAccountId}
                  onChange={(e) => handleData("awsAccountId", e.target.value)}
                ></Input>
              </FormControl>
              {DeploymentData.awsAccountId &&
                DeploymentData.awsAccountId.length !== 12 && (
                  <Alert
                    status="error"
                    height="12px"
                    fontSize="12px"
                    borderRadius="3px"
                    mb={2}
                  >
                    <AlertIcon style={{ width: "14px", height: "14px" }} />
                    Input value must be at least 12 digits
                  </Alert>
                )}
              <FormControl>
                <FormLabel>AWS Region</FormLabel>
                <Select
                  mb={4}
                  variant="outline"
                  id="awsRegion"
                  borderColor={"black"}
                  value={DeploymentData.awsRegion || ""}
                  onChange={(e) => handleData("awsRegion", e.target.value)}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="us-east-2">US East (Ohio)</option>
                  <option value="us-east-1">US East (N. Virginia)</option>
                  <option value="ap-south-1">Asia Pacific (Mumbai)</option>
                </Select>
              </FormControl>
            </div>
          )}
          {selectedImage && selectedImage !== "minikube" ? (
            <FormControl>
              <FormLabel>Deployment Type</FormLabel>
              <Select
                mb={4}
                variant="outline"
                id="deploymentType"
                borderColor={"black"}
                value={DeploymentData.deploymentType}
                onChange={(e) => handleData("deploymentType", e.target.value)}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="kubernetes">Kubernetes</option>
              </Select>
            </FormControl>
          ) : (
            <></>
          )}

          {DeploymentData.deploymentType === "kubernetes" && (
            <div>
              <FormControl>
                <FormLabel>Cluster Name</FormLabel>
                <Input
                  mb={4}
                  variant="outline"
                  id="clusterName"
                  borderColor={"black"}
                  maxLength="63"
                  value={DeploymentData.clusterName}
                  onChange={(e) => handleData("clusterName", e.target.value)}
                />
              </FormControl>
              {DeploymentData.clusterName && !clusterNameCheck ? (
                <Alert
                  status="error"
                  height="12px"
                  fontSize="12px"
                  borderRadius="3px"
                  mb={2}
                >
                  <AlertIcon style={{ width: "14px", height: "14px" }} />
                  Cluster Name should not contain special characters.
                </Alert>
              ) : (
                <></>
              )}
              {azureClusterNameCheck && (
                <Alert
                  status="error"
                  height="12px"
                  fontSize="12px"
                  borderRadius="3px"
                  mb={2}
                >
                  <AlertIcon style={{ width: "14px", height: "14px" }} />
                  The input cannot contain this reserved word
                </Alert>
              )}
              <FormControl>
                <FormLabel>Enable Dynamic Storage</FormLabel>
                <Select
                  mb={4}
                  variant="outline"
                  id="kubernetesUseDynamicStorage"
                  borderColor={"black"}
                  value={DeploymentData.kubernetesUseDynamicStorage}
                  onChange={(e) =>
                    handleData("kubernetesUseDynamicStorage", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </FormControl>
              {DeploymentData.kubernetesUseDynamicStorage === "true" &&
                selectedImage !== "azure" && (
                  <FormControl>
                    <FormLabel>Storage Class Name</FormLabel>
                    <Input
                      mb={4}
                      variant="outline"
                      id="kubernetesStorageClassName"
                      placeholder="Kubernetes Storage Class Name"
                      borderColor={"black"}
                      maxLength="63"
                      value={DeploymentData.kubernetesStorageClassName}
                      onChange={(e) =>
                        handleData("kubernetesStorageClassName", e.target.value)
                      }
                    />
                    {DeploymentData.kubernetesStorageClassName &&
                    !storageClassCheck ? (
                      <Alert
                        status="error"
                        height="38px"
                        fontSize="12px"
                        borderRadius="3px"
                        mb={2}
                      >
                        <AlertIcon style={{ width: "14px", height: "14px" }} />
                        Storage Class Name should not contain special characters
                        or start with uppercase.
                      </Alert>
                    ) : (
                      <></>
                    )}
                  </FormControl>
                )}

              <FormControl>
                <FormLabel>Namespace</FormLabel>
                <Input
                  mb={4}
                  variant="outline"
                  id="kubernetesnamespace"
                  maxLength="63"
                  placeholder="Kubernetes Namespace"
                  borderColor={"black"}
                  value={DeploymentData.kubernetesNamespace}
                  onChange={(e) =>
                    handleData("kubernetesNamespace", e.target.value)
                  }
                />
              </FormControl>
              {DeploymentData.kubernetesNamespace && !namespaceCheck ? (
                <Alert
                  status="error"
                  height="12px"
                  fontSize="12px"
                  borderRadius="3px"
                  mb={2}
                >
                  <AlertIcon style={{ width: "14px", height: "14px" }} />
                  Namespace should not contain special characters.
                </Alert>
              ) : (
                <></>
              )}
              <FormControl>
                <FormLabel>Ingress Type</FormLabel>
                <Select
                  mb={4}
                  variant="outline"
                  id="ingressType"
                  borderColor={"black"}
                  value={DeploymentData.ingressType}
                  onChange={(e) => handleData("ingress", e.target.value)}
                >
                  <option value="istio">Istio</option>
                </Select>
              </FormControl>
              {DeploymentData.ingressType === "istio" && (
                <FormControl>
                  <FormLabel>Ingress Domain Name</FormLabel>
                  <Input
                    mb={4}
                    variant="outline"
                    id="ingressDomain"
                    placeholder="Ingress Domain Name"
                    borderColor={"black"}
                    maxLength="63"
                    value={DeploymentData.ingressDomain}
                    onChange={(e) =>
                      handleData("ingressDomain", e.target.value)
                    }
                  />
                  {DeploymentData.ingressDomain && !domainNameCheck ? (
                    <Alert
                      status="error"
                      height="12px"
                      fontSize="12px"
                      borderRadius="3px"
                      mb={2}
                    >
                      <AlertIcon style={{ width: "14px", height: "14px" }} />
                      Domain name validation is not satisfied.
                    </Alert>
                  ) : (
                    <></>
                  )}
                </FormControl>
              )}
              <FormControl>
                <FormLabel>Enable Service Monitoring</FormLabel>
                <Select
                  mb={4}
                  variant="outline"
                  id="monitoring"
                  borderColor={"black"}
                  value={DeploymentData.monitoring}
                  onChange={(e) => handleData("monitoring", e.target.value)}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Enable Kubernetes Dashboard</FormLabel>
                <Select
                  mb={4}
                  variant="outline"
                  id="k8sWebUI"
                  borderColor={"black"}
                  value={DeploymentData.k8sWebUI}
                  onChange={(e) => handleData("k8sWebUI", e.target.value)}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </FormControl>
            </div>
          )}
          {selectedImage === "minikube" && (
            <>
              <FormControl>
                <FormLabel>Namespace</FormLabel>
                <Input
                  mb={4}
                  variant="outline"
                  id="kubernetesnamespace"
                  maxLength="63"
                  placeholder="Kubernetes Namespace"
                  borderColor={"black"}
                  value={DeploymentData.kubernetesNamespace}
                  onChange={(e) =>
                    handleData("kubernetesNamespace", e.target.value)
                  }
                />
              </FormControl>
              {DeploymentData.kubernetesNamespace && !namespaceCheck ? (
                <Alert
                  status="error"
                  height="12px"
                  fontSize="12px"
                  borderRadius="3px"
                  mb={2}
                >
                  <AlertIcon style={{ width: "14px", height: "14px" }} />
                  Namespace should not contain special characters.
                </Alert>
              ) : (
                <></>
              )}
              <FormControl>
                <FormLabel>Repository Name</FormLabel>
                <Input
                  mb={4}
                  variant="outline"
                  id="dockerRepositoryName"
                  placeholder="Docker Repository Name"
                  borderColor={"black"}
                  maxLength="32"
                  value={DeploymentData.dockerRepositoryName}
                  onChange={(e) =>
                    handleData("dockerRepositoryName", e.target.value)
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Ingress Type</FormLabel>
                <Select
                  mb={4}
                  variant="outline"
                  id="ingressType"
                  borderColor={"black"}
                  value={DeploymentData.ingressType}
                  onChange={(e) => handleData("ingress", e.target.value)}
                >
                  <option value="istio">Istio</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Enable Dynamic Storage</FormLabel>
                <Select
                  mb={4}
                  variant="outline"
                  id="kubernetesUseDynamicStorage"
                  borderColor={"black"}
                  value={DeploymentData.kubernetesUseDynamicStorage}
                  onChange={(e) =>
                    handleData("kubernetesUseDynamicStorage", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Enable Monitoring</FormLabel>
                <Select
                  mb={4}
                  variant="outline"
                  id="monitoring"
                  borderColor={"black"}
                  value={DeploymentData.monitoring}
                  onChange={(e) => handleData("monitoring", e.target.value)}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </FormControl>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              onSubmit(projectData) || isLoading(true);
            }}
            mt={4}
            border="2px"
            borderColor="black.500"
            type="submit"
            marginRight="5px"
          >
            Skip Infrastructure
          </Button>
          <Button
            onClick={() => {
              handleSubmit(DeploymentData) || isLoading(true);
            }}
            mt={4}
            border="2px"
            borderColor="green.500"
            width="100px"
            type="submit"
            isDisabled={!selectedImage || isCheckEmpty() || checkValidation()}
          >
            Submit
          </Button>
          {isLoading && (
            <Flex
              position="fixed"
              top="62"
              left="0"
              right="0"
              bottom="0"
              alignItems="center"
              justifyContent="center"
              backgroundColor="#f5f5f5"
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeployModal;
