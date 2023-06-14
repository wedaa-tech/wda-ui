import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";

const AlertModal = ({ isOpen, onClose, name }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent backgroundColor="#A7C7E7">
        <ModalHeader style={{ fontSize: "14px" }}>
          You have already selected one from this category, Please delete the
          first one if you wish to change your choice.
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "Left",
              backgroundColor: "#3182CE",
            }}
          ></div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AlertModal;
