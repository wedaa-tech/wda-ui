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
        <ModalHeader
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "14px",
          }}
        >
          <span>
            {"Already selected,Please delete existing to change your choice."}
          </span>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody></ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AlertModal;
