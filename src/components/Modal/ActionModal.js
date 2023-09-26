import React from 'react';
import {
    Button,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';

const ActionModal = ({ isOpen = true, onClose, onSubmit, actionType, id, name }) => {
    const cancelRef = React.useRef();

    const actionConfig = {
        delete: {
            title: 'Delete',
            content: `Are you sure you want to delete project "<strong>${name}</strong>"?`,
            cancelText: 'Cancel',
            submitText: 'Delete',
            colorScheme: 'red',
        },
        clearAndNav: {
            title: 'Confirm Navigation',
            content: 'Navigating away from this page without saving will lead to the loss of any unsaved changes',
            cancelText: 'Stay on Page',
            submitText: 'Leave Page',
            colorScheme: 'blue',
        },
        clear: {
            title: 'Clear',
            content: 'Are you sure you want to clear the Canvas?',
            cancelText: 'Cancel',
            submitText: 'Clear',
            colorScheme: 'blue',
        },
    };

    const config = actionConfig[actionType];

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {config.title}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            <span style={{ marginRight: '10px', marginTop: '3px' }}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    data-name="Layer 1"
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5"
                                    height="20"
                                    width="20"
                                    id="warning"
                                >
                                    <path
                                        d="M14.876,2.672a3.309,3.309,0,0,0-5.752,0L.414,18.19a3.178,3.178,0,0,0,.029,3.189A3.264,3.264,0,0,0,3.29,23H20.71a3.264,3.264,0,0,0,2.847-1.621,3.178,3.178,0,0,0,.029-3.189ZM12,19a1,1,0,1,1,1-1A1,1,0,0,1,12,19Zm1-5a1,1,0,0,1-2,0V8a1,1,0,0,1,2,0Z"
                                        fill="#888"
                                    />
                                </svg>
                            </span>
                            <div style={{ flex: '1' }}>Warning: {config.content}</div>
                        </div>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            {config.cancelText}
                        </Button>
                        <Button colorScheme={config.colorScheme} onClick={() => onSubmit({ id })} ml={3}>
                            {config.submitText}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default ActionModal;
