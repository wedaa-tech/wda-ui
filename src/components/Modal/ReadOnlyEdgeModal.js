import {
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import React from "react";

function ReadOnlyEdgeModal({
  edgeModal,
  type,
  typeName,
  framework,
  handleContainerClose,
}) {
  return (
    <Modal isOpen={edgeModal} onClose={handleContainerClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Communication</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}
          >
            <FormControl>
              <FormLabel>Type</FormLabel>
              <Select
                mb={4}
                variant="outline"
                id="type"
                borderColor={"black"}
                value={type}
                isDisabled={true}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="asynchronous">Asynchronous</option>
                <option value="synchronous">Synchronous</option>
              </Select>
            </FormControl>

            {typeName === "synchronous" && (
              <FormControl>
                <FormLabel>Framework</FormLabel>
                <Select
                  mb={4}
                  variant="outline"
                  id="framework"
                  borderColor={"black"}
                  value={framework}
                  isDisabled={true}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="rest">REST</option>
                </Select>
              </FormControl>
            )}
            {typeName === "asynchronous" && (
              <FormControl>
                <FormLabel>Framework</FormLabel>
                <Select
                  mb={4}
                  variant="outline"
                  id="framework"
                  borderColor={"black"}
                  value={framework}
                  isDisabled={true}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="rabbitmq">Rabbit MQ</option>
                </Select>
              </FormControl>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ReadOnlyEdgeModal;
