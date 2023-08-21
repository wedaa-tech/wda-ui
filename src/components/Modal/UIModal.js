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

const UiDataModal = ({ isOpen, onClose, onSubmit, CurrentNode,uniquePortNumbers }) => {
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
  const [PortNumberError, setPortNumberError] = useState(false);  
  const isEmptyUiSubmit = UiData.applicationName === "" ||
    UiData.packageName === "" ||
    UiData.serverPort === "";

  const reservedPorts = ["5601", "9200", "15021", "20001", "3000", "8080"];
  const serverPortCheck =
    UiData.serverPort && reservedPorts.includes(UiData.serverPort);

  const appNameCheck = !/^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$/g.test(
    UiData.applicationName
  );

  const packageNameCheck =
    UiData.packageName &&
    !/^[a-zA-Z](?:[a-zA-Z0-9_.-]*[a-zA-Z0-9])?$/g.test(UiData.packageName);
    
    const ValidatePortNumber = (value) => {
      const isDuplicatePort = uniquePortNumbers.includes(value);
      if ((isDuplicatePort && value !== "") || Number(value) <= 1023 || Number(value) > 65535) {
        setPortNumberError(true);
        return false;
      } else {
          setPortNumberError(false);
          return true;
        }
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

  const handleData = (column, value) => {
    if (column === "label") {
      setUiDataData((prev) => ({
        ...prev,
        [column]: value,
        applicationName: value,
      }));
    }else if (column === "serverPort") {
      ValidatePortNumber(value);
      setUiDataData((prev) => ({
        ...prev,
        [column]: value,
        serverPort: value,
      }));
    }  else {
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
                maxLength="32"
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
                maxLength="32"
                value={UiData.packageName}
                onChange={(e) => handleData("packageName", e.target.value)}
              />
            </FormControl>
            {packageNameCheck && (
              <Alert
                status="error"
                height="12px"
                fontSize="12px"
                borderRadius="3px"
                mb={2}
              >
                <AlertIcon style={{ width: "14px", height: "14px" }} />
                Enter a valid package name
              </Alert>
            )}
            <FormControl>
              <FormLabel>Server Port</FormLabel>
              <Input
                mb={4}
                variant="outline"
                id="serverPort"
                placeholder="9000"
                borderColor={(serverPortCheck||PortNumberError) ? "red" : "black"}
                value={UiData.serverPort}
                maxLength="5"
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
                The input cannot contain reserved port number
              </Alert>
            )}
            {PortNumberError && (
              <Alert
                status="error"
                height="12px"
                fontSize="12px"
                borderRadius="3px"
                mb={2}
              >
                <AlertIcon style={{ width: "14px", height: "14px" }} />
                Port Number Conflict
                </Alert>
            )}
          </div>
          <Button
            onClick={() => onSubmit(UiData)}
            style={{ display: "block", margin: "0 auto" }}
            isDisabled={isEmptyUiSubmit || appNameCheck || serverPortCheck || PortNumberError}
          >
            Submit
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default UiDataModal;
