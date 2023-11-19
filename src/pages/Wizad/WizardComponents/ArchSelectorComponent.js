import React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';
import icontest from '../../../assets/fi_star.svg'; // Replace with your image path

const ArchSelectorComponent = ({ value, setSelectedArch }) => {
    return (
        <Box onClick={() => setSelectedArch(value)} className="arch-selector">
            <Box className="arch-icon">
                <Image src={icontest} />
            </Box>
            <Box className="arch-text">
                <Text>Profile Website</Text>
                <Text>2 samples</Text>
            </Box>
        </Box>
    );
};

export default ArchSelectorComponent;
