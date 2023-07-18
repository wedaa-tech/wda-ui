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
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const UiDataModal = ({ isOpen, onClose, onSubmit, CurrentNode }) => {
  const IntialState = {
    label: "UI",
    applicationName: "UI",
    clientFramework: "react",
    packageName: "",
    serverPort: "",
    withExample: "false",
    applicationType: "gateway",
    ...CurrentNode,
  };
  const [UiData, setUiDataData] = useState(IntialState);
  const isEmptyUiSubmit =
    UiData.applicationName === "" ||
    UiData.packageName === "" ||
    UiData.serverPort === "";

  const forbiddenPorts = ["8080", "5601", "9200"];
  const serverPortCheck =
    UiData.serverPort && forbiddenPorts.includes(UiData.serverPort);

  const appNameCheck = !/^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$/g.test(
    UiData.applicationName
  );

  const handleKeyPress = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || charCode === 8) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  };

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
        <ModalHeader style={{ textAlign: "center" }}>
          User Interface
        </ModalHeader>
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
              {appNameCheck && (
                <Alert
                  status="error"
                  height="12px"
                  fontSize="12px"
                  borderRadius="3px"
                  mb={2}
                >
                  <AlertIcon style={{ width: "14px", height: "14px" }} />
                  Enter a valid application name
                </Alert>
              )}
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
                placeholder="9000"
                borderColor={"black"}
                value={UiData.serverPort}
                maxLength="4"
                onKeyPress={handleKeyPress}
                onChange={(e) => handleData("serverPort", e.target.value)}
              />
            </FormControl>
            {serverPortCheck && (
              <Alert
                status="error"
                height="12px"
                fontSize="12px"
                borderRadius="3px"
                mb={2}
              >
                <AlertIcon style={{ width: "14px", height: "14px" }} />
                The input contain cannot this reserved port number
              </Alert>
            )}
          </div>
          <Button
            onClick={() => onSubmit(UiData)}
            style={{ display: "block", margin: "0 auto" }}
            isDisabled={isEmptyUiSubmit || appNameCheck || serverPortCheck}
          >
            Submit
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default UiDataModal;
