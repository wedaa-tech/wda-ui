import React from 'react';
import { Box, Text, Image } from '@chakra-ui/react';
import project_icon from '../../assets/canvas/project_icon.png';
import { ArrowRightIcon } from '@chakra-ui/icons';
import './CanvasContent.css';

function CanvasContent() {
    return (
        <Box flex={'1'} display={'flex'} justifyContent={'center'} alignItems={'center'} transition={'all 3s ease-in-out'}>
            <Box className="box-style">
                <div className="content">
                    <Image 
                        src={project_icon} 
                        alt="Software Architecture freepik icon" 
                        boxSize="100px" 
                        className="cloud-icon"
                    />
                </div>
                <Text className="text">Design your application architecture here</Text>
                 <Text 
                    fontSize="lg" 
                    fontWeight="bold" 
                    color="blue.500" 
                    display="flex" 
                    alignItems="center"
                    mt={2} 
                >
                    Drag & Drop <ArrowRightIcon className="arrow-icon" ml={2} />
                </Text>
                <br/>
                <Text className="sub-text">Click next to auto generate code and setup infrastructure</Text>
                
            </Box>
        </Box>
    );
}

export default CanvasContent;
