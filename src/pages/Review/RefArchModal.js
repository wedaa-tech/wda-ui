import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input } from "@chakra-ui/react";
import { useState } from "react";

const RefArchModal = ({ isOpen, onClose, onSubmit }) => {
    const [projectName, setProjectName] = useState("");

    const handleSubmit = () => {
        onSubmit(projectName);
        setProjectName("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} >
            <ModalOverlay />
            <ModalContent   style={{
                    top: '200px',
                }}>
                <ModalHeader>Enter Reference Architecture Name</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input 
                        placeholder="Reference Architecture Name" 
                        value={projectName} 
                        onChange={(e) => setProjectName(e.target.value)} 
                    />
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default RefArchModal;
