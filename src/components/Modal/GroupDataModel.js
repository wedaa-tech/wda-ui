import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  Button,
  FormLabel,
  FormControl,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const GroupDataModal = ({ isOpen, onClose, onSubmit, CurrentNode }) => {
  const IntialState = {
    label: "Group",
    type: "Group",
    color: "#000000",
    ...CurrentNode,
  };
  const [groupData, setGroupData] = useState(IntialState);

  useEffect(() => {
    const handleDeleteKeyPress = (event) => {
      if (
        isOpen &&
        (event.key === "Backspace" || event.key === "Delete") &&
        event.target.tagName !== "INPUT"
      ) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleDeleteKeyPress);
    return () => {
      window.removeEventListener("keydown", handleDeleteKeyPress);
    };
  }, [isOpen, onClose]);

  const handleData = (column, value) => {
    if (column === "label") {
      setGroupData((prev) => ({
        ...prev,
        [column]: value,
        groupName: value,
      }));
    } else {
      setGroupData((prev) => ({
        ...prev,
        [column]: value,
      }));
    }
  };
  const groupNameCheck = !/^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$/g.test(
    groupData.label
  );

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)}>
      <ModalContent
        style={{
          position: "absolute",
          top: "20px",
          right: "10px",
          width: "300px",
        }}
      >
        <ModalHeader>Group</ModalHeader>
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
              <FormLabel>Group name</FormLabel>
              <Input
                mb={3}
                variant="outline"
                id="groupName"
                placeholder="Name"
                borderColor={"black"}
                maxLength="32"
                value={groupData.label}
                onChange={(e) => handleData("label", e.target.value)}
              />
            </FormControl>
            {groupNameCheck && (
              <Alert
                status="error"
                height="10px"
                fontSize="10px"
                borderRadius="3px"
                mb={4}
              >
                <AlertIcon style={{ width: "14px", height: "14px" }} />
                Enter valid group name
              </Alert>
            )}
          </div>
          <Button
            onClick={() => onSubmit(groupData)}
            style={{ display: "block", margin: "0 auto" }}
            isDisabled={groupNameCheck}
          >
            Submit
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default GroupDataModal;
