import React, { useState } from "react";
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

const UiDataModal = ({ isOpen, onClose, onSubmit, CurrentNode }) => {
  const IntialState = {
    label: "UI",
    applicationName: "UI",
    clientFramework: "react",
    packageName: "",
    serverPort: "",
    withExample: "",
    applicationType: "gateway",
    ...CurrentNode,
  };
  const [UiData, setUiDataData] = useState(IntialState);

  const handleData = (column, value) => {
    if (column === "label") {
      setUiDataData((prev) => ({
        ...prev,
        [column]: value,
        applicationName: value,
      }));
    } else {
      setUiDataData((prev) => ({
        ...prev,
        [column]: value,
      }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>UI</ModalHeader>
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
                value={UiData.applicationName}
                onChange={(e) => handleData("label", e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Client Framework</FormLabel>
              <Select
                mb={4}
                variant="outline"
                id="clientFramework"
                borderColor={"black"}
                value={UiData.clientFramework}
                onChange={(e) => handleData("clientFramework", e.target.value)}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="react">React</option>
                <option value="angular">Angular</option>
                <option value="vue">Vue</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Package Name</FormLabel>
              <Input
                mb={4}
                variant="outline"
                id="packageName"
                placeholder="packageName"
                borderColor={"black"}
                value={UiData.packageName}
                onChange={(e) => handleData("packageName", e.target.value)}
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
                value={UiData.serverPort}
                onChange={(e) => handleData("serverPort", e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Want to have an Example</FormLabel>
              <Select
                mb={4}
                variant="outline"
                id="withExample"
                borderColor={"black"}
                value={UiData.withExample}
                onChange={(e) => handleData("withExample", e.target.value)}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </FormControl>
          </div>
          <Button
            onClick={() => onSubmit(UiData)}
            style={{ display: "block", margin: "0 auto" }}
          >
            Submit
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UiDataModal;
