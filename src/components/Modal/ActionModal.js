import React from "react";
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

const ActionModal = ({
  isOpen = true,
  onClose,
  onSubmit,
  actionType,
  id,
  name,
}) => {
  const cancelRef = React.useRef();
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {actionType === "delete" ? "Delete" : "Confirm Navigation"}
          </AlertDialogHeader>

          <AlertDialogBody>
            {actionType === "delete" ? (
              <>
                Are you sure you want to delete project "<strong>{name}</strong>
                "?
              </>
            ) : (
              <>
                Navigating away from this page without saving will lead to the
                loss of any unsaved changes
              </>
            )}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {actionType === "delete" ? "Cancel" : "Stay on Page"}
            </Button>
            <Button
              colorScheme={actionType === "delete" ? "red" : "blue"}
              onClick={() => onSubmit({ id })}
              ml={3}
            >
              {actionType === "delete" ? "Delete" : "Leave Page"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ActionModal;
