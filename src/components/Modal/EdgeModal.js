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
    Input,
} from '@chakra-ui/react';

const EdgeModal = ({ isOpen, CurrentEdge, onClose, handleEdgeData, handleColorClick, nodes }) => {
    const initialState = {
        type: '',
        framework: '',
        label: '',
        ...CurrentEdge,
    };
    const [edgeData, setEdgeData] = useState(initialState);
    const [connectingNodes, setConnectingNodes] = useState({ client: '', server: '' });
    const [communicationPattern,setCommunicationPattern]= useState({labelone:'Client',labeltwo:'Server'})
   
    useEffect(() => {
        const labelone = edgeData.framework === 'rest-api' ? 'Client' : 'Producer';
        const labeltwo = edgeData.framework === 'rest-api' ? 'Server' : 'Consumer';
        
        setCommunicationPattern({
            labelone,
            labeltwo
        });
    }, [edgeData.framework]);

    useEffect(() => {
        const [source, destination] = isOpen.split('-');
        setConnectingNodes({ client: nodes[source].data.applicationName, server: nodes[destination].data.applicationName });
    });
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

    const commonServiceType = isOpen.split('-')[1];
    const isCommonService =
        commonServiceType === 'authenticationType' || commonServiceType === 'logManagement' || commonServiceType === 'serviceDiscoveryType';
    const isEmpty = isCommonService ? false : edgeData.type === '' || edgeData.framework === '';
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

    const checkIfBothAreServices = edgeName => {
        const [source, destination] = edgeName.split('-');
        return source.startsWith('Service') && destination.startsWith('Service') ? true : false;
    };

    return (
        <Modal isOpen={isOpen} onClose={() => onClose(false)}>
            <ModalContent
                style={{
                    position: 'absolute',
                    top: '100px',
                    right: '10px',
                    width: '300px',
                }}
            >
                <ModalHeader>Communication</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div style={{ marginBottom: '1rem' }}>
                        {(edgeData.framework === 'rabbitmq'||edgeData.framework === 'rest-api') && (
                            <div style={{ marginBottom: '0.5rem' }}>
                                <span style={{ marginRight: '0.5rem' }}>{communicationPattern.labelone} :</span>
                                <span style={{fontWeight: 'bold'}}>{connectingNodes.client}</span>
                                <br />
                                <span style={{marginRight: '0.5rem' }}>{communicationPattern.labeltwo} :</span>
                                <span style={{fontWeight: 'bold'}}>{connectingNodes.server}</span>
                            </div>
                        )}
                    </div>

                    {checkIfBothAreServices(isOpen) && (
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
                    )}
                    {!checkIfBothAreServices(isOpen) && (
                        <FormControl>
                            <FormLabel>Label</FormLabel>
                            <Input
                                mb={4}
                                variant="outline"
                                id="label"
                                placeholder="Display Name"
                                borderColor={'black'}
                                maxLength="32"
                                value={edgeData.label}
                                onChange={e => handleData('label', e.target.value)}
                            />
                        </FormControl>
                    )}
                    <FormLabel>Background Color</FormLabel>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginBottom: '20px',
                            gap: '15px',
                        }}
                    >
                        <div
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                backgroundColor: '#ffc9c9',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleColorClick('#ffc9c9')}
                        ></div>
                        <div
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                backgroundColor: '#b2f2bb',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleColorClick('#b2f2bb')}
                        ></div>
                        <div
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                backgroundColor: '#a5d8ff',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleColorClick('#a5d8ff')}
                        ></div>
                        <div
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                backgroundColor: '#ffec99',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleColorClick('#ffec99')}
                        ></div>
                        <div
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                backgroundColor: '#000000',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleColorClick('#000000')}
                        ></div>
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
