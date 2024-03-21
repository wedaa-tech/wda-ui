import React from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';
import { FiUploadCloud } from 'react-icons/fi';
import './CanvasContent.css';

function CanvasContent() {
    return (
        <Box flex={'1'} display={'flex'} justifyContent={'center'} alignItems={'center'} transition={'all 3s ease-in-out'}>
            <Box className="boxStyle">
                <div className="content">
                    <FiUploadCloud className="cloudIcon" />
                </div>
                <Text className="text">Design your application architecture here</Text>
                <Text className="subText">Click next to auto generate code and setup infrastructure</Text>
                <Button>
                    Drag & Drop <ArrowRightIcon className="arrowIcon" />
                </Button>
            </Box>
        </Box>
    );
}

export default CanvasContent;
