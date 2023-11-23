import React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';
import icontest from '../../../assets/fi_star.svg'; // Replace with your image path
import { componentsMapping } from '../CONSTANTS';

const ArchSelectorComponent = ({ value, setSelectedArch, samples }) => {
    return (
        <Box onClick={() => setSelectedArch(value)} className="arch-selector">
            <Box className="arch-icon">
                <Image src={icontest} />
            </Box>
            <Box className="arch-text">
                <Text>{componentsMapping[value]}</Text>
                <Text>Sample</Text>
            </Box>
        </Box>
    );
};

export default ArchSelectorComponent;
