import React, { useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import ZoomableImageWithDescription from './ZoomableImageModal'; // Adjust the path
import { ReactFlowProvider } from 'reactflow';

const ZoomableImageModalWrapper = ({ imageUrl, description, name, nodes, edges }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <ReactFlowProvider>
            <Box width={'100%'} as="button" bgImage={imageUrl} className="image-select" onClick={handleOpenModal}>
                <Text className="not-selectable image-text">{name}</Text>
            </Box>
            <ZoomableImageWithDescription
                imageUrl={imageUrl}
                description={description}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={name}
                nodes={nodes}
                edges={edges}
            />
        </ReactFlowProvider>
    );
};

export default ZoomableImageModalWrapper;
