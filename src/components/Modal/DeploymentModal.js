import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  Select,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";

const DeploymentModal = ({
  cloudModal,
  handleContainerClose,
  cloudName,
  awsAccountId,
  awsRegion,
  kubernetesStorageClassName,
  azureLocation,
  subscriptionId,
  tenantId,
  clusterName,
  deploymentType,
  ingressDomain,
  ingressType,
  k8sWebUI,
  kubernetesNamespace,
  kubernetesUseDynamicStorage,
  monitoring,
  dockerRepositoryName,
}) => {
  return (
    <>
      <Modal
        isOpen={cloudModal}
        onClose={handleContainerClose}
        isCentered={true}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h2 style={{ display: "inline-block" }}>
              Deployment Infrastructure
            </h2>
          </ModalHeader>
          <ModalCloseButton onClick={handleContainerClose} />
          <ModalBody
            style={{
              maxHeight: "calc(100vh - 200px)",
              overflowY: "auto",
              maxHeight: "600px",
            }}
          >
            {cloudName === "azure" && (
              <div>
                <FormControl>
                  <FormLabel>Subscription Id</FormLabel>
                  <Input
                    mb={4}
                    variant="outline"
                    id="subscriptionId"
                    borderColor={"black"}
                    value={subscriptionId}
                    disabled={true}
                  ></Input>
                </FormControl>
                <FormControl>
                  <FormLabel>Tenant ID</FormLabel>
                  <Input
                    mb={4}
                    variant="outline"
                    id="tenantId"
                    borderColor={"black"}
                    value={tenantId}
                    disabled={true}
                  ></Input>
                </FormControl>
                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Select
                    mb={4}
                    variant="outline"
                    id="location"
                    borderColor={"black"}
                    value={azureLocation}
                    disabled={true}
                  >
                    <option value="canadacentral">Canada Central</option>
                  </Select>
                </FormControl>
              </div>
            )}
            {cloudName === "aws" && (
              <div>
                <FormControl>
                  <FormLabel>AWS Account ID</FormLabel>
                  <Input
                    mb={4}
                    variant="outline"
                    type="text"
                    placeholder="123456789"
                    id="awsAccountId"
                    borderColor={"black"}
                    value={awsAccountId}
                    disabled={true}
                  ></Input>
                </FormControl>
                <FormControl>
                  <FormLabel>AWS Region</FormLabel>
                  <Select
                    mb={4}
                    variant="outline"
                    id="awsRegion"
                    borderColor={"black"}
                    value={awsRegion}
                    disabled={true}
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
            {cloudName && cloudName !== "minikube" ? (
              <FormControl>
                <FormLabel>Deployment Type</FormLabel>
                <Select
                  mb={4}
                  variant="outline"
                  id="deploymentType"
                  borderColor={"black"}
                  value={deploymentType}
                  disabled={true}
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

            {deploymentType === "kubernetes" && (
              <div>
                <FormControl>
                  <FormLabel>Cluster Name</FormLabel>
                  <Input
                    mb={4}
                    variant="outline"
                    id="clusterName"
                    borderColor={"black"}
                    value={clusterName}
                    disabled={true}
                  ></Input>
                </FormControl>

                <FormControl>
                  <FormLabel>Enable Dynamic Storage</FormLabel>
                  <Select
                    mb={4}
                    variant="outline"
                    id="kubernetesUseDynamicStorage"
                    borderColor={"black"}
                    value={kubernetesUseDynamicStorage}
                    disabled={true}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Select>
                </FormControl>
                {kubernetesUseDynamicStorage === "true" &&
                  cloudName !== "azure" && (
                    <FormControl>
                      <FormLabel>Storage Class Name</FormLabel>
                      <Input
                        mb={4}
                        variant="outline"
                        id="kubernetesStorageClassName"
                        placeholder="Kubernetes Storage Class Name"
                        borderColor={"black"}
                        value={kubernetesStorageClassName}
                        disabled={true}
                      />
                    </FormControl>
                  )}

                <FormControl>
                  <FormLabel>Namespace</FormLabel>
                  <Input
                    mb={4}
                    variant="outline"
                    id="kubernetesnamespace"
                    placeholder="Kubernetes Namespace"
                    borderColor={"black"}
                    value={kubernetesNamespace}
                    disabled={true}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Ingress Type</FormLabel>
                  <Select
                    mb={4}
                    variant="outline"
                    id="ingressType"
                    borderColor={"black"}
                    value={ingressType}
                    disabled={true}
                  >
                    <option value="istio">Istio</option>
                  </Select>
                </FormControl>
                {ingressType === "istio" && (
                  <FormControl>
                    <FormLabel>Ingress Domain Name</FormLabel>
                    <Input
                      mb={4}
                      variant="outline"
                      id="ingressDomain"
                      placeholder="Ingress Domain Name"
                      borderColor={"black"}
                      value={ingressDomain}
                      disabled={true}
                    />
                  </FormControl>
                )}
                <FormControl>
                  <FormLabel>Enable Monitoring</FormLabel>
                  <Select
                    mb={4}
                    variant="outline"
                    id="monitoring"
                    borderColor={"black"}
                    value={monitoring}
                    disabled={true}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Enable Web UI</FormLabel>
                  <Select
                    mb={4}
                    variant="outline"
                    id="k8sWebUI"
                    borderColor={"black"}
                    value={k8sWebUI}
                    disabled={true}
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
            {cloudName === "minikube" && (
              <>
                <FormControl>
                  <FormLabel>Namespace</FormLabel>
                  <Input
                    mb={4}
                    variant="outline"
                    id="kubernetesnamespace"
                    placeholder="Kubernetes Namespace"
                    borderColor={"black"}
                    value={kubernetesNamespace}
                    disabled={true}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Repository Name</FormLabel>
                  <Input
                    mb={4}
                    variant="outline"
                    id="dockerRepositoryName"
                    placeholder="Docker Repository Name"
                    borderColor={"black"}
                    value={dockerRepositoryName}
                    disabled={true}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Ingress Type</FormLabel>
                  <Select
                    mb={4}
                    variant="outline"
                    id="ingressType"
                    borderColor={"black"}
                    value={ingressType}
                    disabled={true}
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
                    value={kubernetesUseDynamicStorage}
                    disabled={true}
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
                    value={monitoring}
                    disabled={true}
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
        </ModalContent>
      </Modal>
    </>
  );
};
export default DeploymentModal;
