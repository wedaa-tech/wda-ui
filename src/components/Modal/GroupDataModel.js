import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Input, Button, FormLabel, FormControl } from '@chakra-ui/react';

const GroupDataModal = ({ isOpen, onClose, onSubmit, CurrentNode, handleColorClick, nodeType = 'Group' }) => {
    const IntialState = {
        label: 'Group',
        type: 'Group',
        color: '#fff',
        ...CurrentNode,
    };
    const [groupData, setGroupData] = useState(IntialState);

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

    const handleData = (column, value) => {
        if (column === 'label') {
            setGroupData(prev => ({
                ...prev,
                [column]: value,
                groupName: value,
            }));
        } else {
            setGroupData(prev => ({
                ...prev,
                [column]: value,
            }));
        }
    };
    const groupNameCheck = !groupData.label;

    return (
        <Modal isOpen={isOpen} onClose={() => onClose(false)}>
            <ModalContent
                style={{
                    position: 'absolute',
                    top:  `100px`,
                    right: '10px',
                    width: '300px',
                }}
            >
                <ModalHeader>{nodeType}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'Left',
                        }}
                    >
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input
                                mb={3}
                                variant="outline"
                                id="groupName"
                                placeholder="Display Name"
                                borderColor={'black'}
                                maxLength="32"
                                value={groupData.label}
                                onChange={e => handleData('label', e.target.value)}
                            />
                        </FormControl>
                    </div>
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
                                        className="color"
                                        style={{
                                            backgroundColor: '#ffc9c9',
                                            border: groupData.color === '#ffc9c9' ? '2px solid #007bff' : '1px solid #cfcfcf',
                                        }}
                                        onClick={() => {
                                            handleData('color', '#ffc9c9');
                                            handleColorClick('#ffc9c9');
                                        }}
                                    ></div>
                                    <div
                                        className="color"
                                        style={{
                                            border: groupData.color === '#b2f2bb' ? '2px solid #007bff' : '1px solid #cfcfcf',
                                            backgroundColor: '#b2f2bb',
                                        }}
                                        onClick={() => {
                                            handleData('color', '#b2f2bb');
                                            handleColorClick('#b2f2bb');
                                        }}
                                    ></div>
                                    <div
                                        className="color"
                                        style={{
                                            border: groupData.color === '#a5d8ff' ? '2px solid #007bff' : '1px solid #cfcfcf',
                                            backgroundColor: '#a5d8ff',
                                        }}
                                        onClick={() => {
                                            handleData('color', '#a5d8ff');
                                            handleColorClick('#a5d8ff');
                                        }}
                                    ></div>
                                    <div
                                        className="color"
                                        style={{
                                            border: groupData.color === '#ffec99' ? '2px solid #007bff' : '1px solid #cfcfcf',
                                            backgroundColor: '#ffec99',
                                        }}
                                        onClick={() => {
                                            handleData('color', '#ffec99');
                                            handleColorClick('#ffec99');
                                        }}
                                    ></div>
                                    <div
                                        className="color"
                                        style={{
                                            border: groupData.color === '#fff' ? '2px solid #007bff' : '1px solid #cfcfcf',
                                            backgroundColor: '#fff',
                                        }}
                                        onClick={() => {
                                            handleData('color', '#fff');
                                            handleColorClick('rgba(255, 255, 255, 0)');
                                        }}
                                    ></div>
                                </div>
                    <Button onClick={() => onSubmit(groupData)} style={{ display: 'block', margin: '0 auto' }} isDisabled={groupNameCheck}>
                        Save
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
export default GroupDataModal;
