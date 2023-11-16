import { DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, Image, Text } from '@chakra-ui/react';
import React from 'react';

const GreenCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="green">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 18 21 6l-1.41-1.41L9 16.17z" />
    </svg>
);

const RedCloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="red">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
);

const ArchitectureCard = ({ title, description, imageUrl, projectId, onClick, data, onDelete, published, parentId }) => {
    return (
        <Box
            maxWidth={96}
            minWidth={96}
            maxW="sm"
            className="project-card"
            height={'300px'}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            cursor="pointer"
            position="relative"
            p="6"
            zIndex="1"
            backgroundColor={'white'}
            onClick={() => onClick(projectId, data)}
        >
            <Image
                style={{
                    width: '100%',
                    objectFit: 'contain',
                    mixBlendMode: 'darken',
                }}
                height="65%"
                src={imageUrl}
                alt={title}
            />
            <IconButton
                top="5%"
                right="5%"
                variant="outline"
                colorScheme="blackAlpha"
                aria-label="Delete Architecture"
                position="absolute"
                zIndex={99}
                icon={<DeleteIcon />}
                onClick={e => {
                    onDelete(title, projectId);
                    e.stopPropagation();
                }}
            />
            {parentId === 'admin' && (
                <Box position="absolute" top="24%" right="9%" zIndex={99}>
                    {published ? <GreenCheckIcon /> : <RedCloseIcon />}
                </Box>
            )}
            <Box p="6">
                <Text
                    className="not-selectable"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}
                    fontWeight="semibold"
                    fontSize="lg"
                    mb="2"
                >
                    {title}
                </Text>
                <Text className="not-selectable" color="gray.600">
                    {description}
                </Text>
            </Box>
        </Box>
    );
};

export default ArchitectureCard;
