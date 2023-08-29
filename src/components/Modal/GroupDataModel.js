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

const GroupDataModal = ({ isOpen, onClose, onSubmit, CurrentNode,handleColorClick, }) => {
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
          <FormLabel>Background Color</FormLabel>
          <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: "20px",
            gap: "15px",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
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
              border:"1px solid #cfcfcf",
              borderRadius: "50%",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
            onClick={() => handleColorClick("#fff")}
          ></div>
        </div>
          <Button
            onClick={() => onSubmit(groupData)}
            style={{ display: "block", margin: "0 auto" }}
            isDisabled={groupNameCheck}
          >
            Save
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default GroupDataModal;
