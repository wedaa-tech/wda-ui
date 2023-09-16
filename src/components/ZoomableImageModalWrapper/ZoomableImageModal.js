import React, { useState, useRef } from 'react';
import { Box, Image, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
// import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const ZoomableImageWithDescription = ({ imageUrl, description, isOpen, onClose, title }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody px={10}>
                    <Box display="flex" flexDirection="row" alignItems="flex-start">
                        <Text width={'50%'} mt={4}>
                            {description}
                        </Text>
                        {/* <TransformWrapper>
              <TransformComponent>
                <Image
                  width="100%"
                  maxWidth="100%"
                  overflow="auto"
                  minHeight="calc(100vh - 200px)"
                  minWidth="calc(100vh - 200px)"
                  alignItems={"center"}
                  src={imageUrl}
                  objectFit={"contain"}
                />
              </TransformComponent>
            </TransformWrapper> */}
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ZoomableImageWithDescription;
