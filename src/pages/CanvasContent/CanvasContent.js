import React from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';
import { FiUploadCloud } from 'react-icons/fi';
import './CanvasContent.css';

function CanvasContent() {
    return (
        <Box flex={'1'} display={'flex'} justifyContent={'center'} alignItems={'center'} transition={'all 3s ease-in-out'}>
            <Box className="box-style">
                <div className="content">
                    <FiUploadCloud className="cloud-icon" />
                </div>
                <Text className="text">Design your application architecture here</Text>
                <Text className="sub-text">Click next to auto generate code and setup infrastructure</Text>
                <Button>
                    Drag & Drop <ArrowRightIcon className="arrow-icon" />
                </Button>
            </Box>
        </Box>
    );
}

export default CanvasContent;
