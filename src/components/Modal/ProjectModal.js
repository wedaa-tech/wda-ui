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
  Button,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";

const ProjectModal = ({
  nodeType,
  serviceModal,
  handleContainerClose,
  applicationName,
  clientFramework,
  applicationFramework,
  packageName,
  serverPort,
  withExample,
 
}) => {
  return (
    <>
      <Modal
        isOpen={serviceModal}
        onClose={handleContainerClose}
        isCentered={true}
      >
        <ModalOverlay />
        <ModalContent>
          {nodeType === "UI" ? (
            <ModalHeader>UI</ModalHeader>
          ) : (
            <ModalHeader>Service</ModalHeader>
          )}
          <ModalCloseButton />
          <ModalBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "Left",
              }}
            >
              <FormControl>
                <FormLabel>Application name</FormLabel>
                <Input
                  mb={4}
                  variant="outline"
                  id="applicationName"
                  placeholder="Name"
                  borderColor={"black"}
                  value={applicationName}
                  isDisabled={true}
                />
              </FormControl>
              {nodeType === "UI" ? (
                <FormControl>
                  <FormLabel>Client Framework</FormLabel>
                  <Select
                    mb={4}
                    variant="outline"
                    id="clientFramework"
                    borderColor={"black"}
                    value={clientFramework}
                    isDisabled={true}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="react">React</option>
                    <option value="angular">Angular</option>
                    <option value="vue">Vue</option>
                  </Select>
                </FormControl>
              ) : (
                <FormControl>
                  <FormLabel>Application Framework</FormLabel>
                  <Select
                    mb={4}
                    variant="outline"
                    id="applicationFramework"
                    borderColor={"black"}
                    value={applicationFramework}
                    isDisabled={true}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="java">Java</option>
                    <option value="gomicro">Go Micro</option>
                  </Select>
                </FormControl>
              )}

              <FormControl>
                <FormLabel>Package Name</FormLabel>
                <Input
                  mb={4}
                  variant="outline"
                  id="packageName"
                  placeholder="packageName"
                  borderColor={"black"}
                  value={packageName}
                  isDisabled={true}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Server Port</FormLabel>
                <Input
                  mb={4}
                  variant="outline"
                  id="serverPort"
                  placeholder="serverPort"
                  borderColor={"black"}
                  value={serverPort}
                  isDisabled={true}
                />
              </FormControl>
              {nodeType === "UI" && (
                <FormControl>
                  <FormLabel>Want to have an Example</FormLabel>
                  <Select
                    mb={4}
                    variant="outline"
                    id="withExample"
                    borderColor={"black"}
                    value={withExample}
                    isDisabled={true}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Select>
                </FormControl>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ProjectModal;
