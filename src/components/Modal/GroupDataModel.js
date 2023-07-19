import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  Button,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";

const GroupDataModal = ({ isOpen, onClose, onSubmit, CurrentNode }) => {
  const IntialState = {
    label: "Group",
    type: "Group",
    color: "#000000",
    ...CurrentNode,
  };
  const [groupData, setGroupData] = useState(IntialState);

  const handleData = (column, value) => {
    if (column === "label") {
      setGroupData((prev) => ({
        ...prev,
        [column]: value,
        applicationName: value,
      }));
    } else {
      setGroupData((prev) => ({
        ...prev,
        [column]: value,
      }));
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
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
                mb={4}
                variant="outline"
                id="applicationName"
                placeholder="Name"
                borderColor={"black"}
                maxLength="32"
                value={groupData.label}
                onChange={(e) => handleData("label", e.target.value)}
              />
            </FormControl>
          </div>
          <Button
            onClick={() => onSubmit(groupData)}
            style={{ display: "block", margin: "0 auto" }}
          >
            Submit
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default GroupDataModal;
