import { DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, Image, Text } from '@chakra-ui/react';
import React from 'react';

const ArchitectureCard = ({ title, description, imageUrl, projectId, onClick, data, onDelete }) => {
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
