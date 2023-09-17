import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Select,
    Button,
    FormLabel,
    FormControl,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';

const EdgeModal = ({
  isOpen,
  CurrentEdge,
  onClose,
  handleEdgeData,
}) => {
  const initialState = {
    type: "",
    framework: "",
    ...CurrentEdge,
  };
  const [edgeData, setEdgeData] = useState(initialState);

    useEffect(() => {
        const handleDeleteKeyPress = event => {
            if (isOpen && (event.key === 'Backspace' || event.key === 'Delete') && event.target.tagName !== 'INPUT') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleDeleteKeyPress);
        return () => {
            window.removeEventListener('keydown', handleDeleteKeyPress);
        };
    }, [isOpen, onClose]);

    const isEmpty = edgeData.type === '' || edgeData.framework === '';

    const handleData = (column, value) => {
        if (column === 'type') {
            setEdgeData(prev => ({
                ...prev,
                [column]: value,
                framework: '',
            }));
        } else {
            setEdgeData(prev => ({
                ...prev,
                [column]: value,
            }));
        }
    };

    function handleSubmit(edgeData) {
        handleEdgeData(edgeData);
    }

    return (
        <Modal isOpen={isOpen} onClose={() => onClose(false)}>
            <ModalContent
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '10px',
                    width: '300px',
                }}
            >
                <ModalHeader>Communication</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'left',
                        }}
                    >
                        <FormControl>
                            <FormLabel>Type</FormLabel>
                            <Select
                                mb={4}
                                variant="outline"
                                id="type"
                                borderColor={'black'}
                                value={edgeData.type}
                                onChange={e => handleData('type', e.target.value)}
                            >
                                <option value="" disabled>
                                    Select an option
                                </option>
                                <option value="asynchronous">Asynchronous</option>
                                <option value="synchronous">Synchronous</option>
                            </Select>
                        </FormControl>

                        {edgeData.type === 'synchronous' && (
                            <FormControl>
                                <FormLabel>Framework</FormLabel>
                                <Select
                                    mb={4}
                                    variant="outline"
                                    id="framework"
                                    borderColor={'black'}
                                    value={edgeData.framework}
                                    onChange={e => handleData('framework', e.target.value)}
                                >
                                    <option value="" disabled>
                                        Select an option
                                    </option>
                                    <option value="rest-api">REST</option>
                                </Select>
                            </FormControl>
                        )}
                        {edgeData.type === 'asynchronous' && (
                            <FormControl>
                                <FormLabel>Framework</FormLabel>
                                <Select
                                    mb={4}
                                    variant="outline"
                                    id="framework"
                                    borderColor={'black'}
                                    value={edgeData.framework}
                                    onChange={e => handleData('framework', e.target.value)}
                                >
                                    <option value="" disabled>
                                        Select an option
                                    </option>
                                    <option value="rabbitmq">Rabbit MQ</option>
                                    {/* <option value="kafka">Kafka</option>
                  <option value="pulsar">Pulsar</option> */}
                </Select>
              </FormControl>
            )}
            {/* {edgeData.type === "synchronous" &&
              edgeData.framework === "rest" &&
              !isMessageBroker && (
                <Alert
                  status="error"
                  height="12px"
                  fontSize="12px"
                  borderRadius="3px"
                  mb={2}
                >
                  <AlertIcon style={{ width: "14px", height: "14px" }} />
                  Please select a message broker to save
                </Alert>
              )} */}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button style={{ display: 'block', margin: '0 auto' }} isDisabled={isEmpty} onClick={() => handleSubmit(edgeData)}>
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EdgeModal;
