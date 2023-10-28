import React from 'react';
import { Box, Text, useStyleConfig } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';


const ReviewBox = ({ selections, idMappings }) => {

    return (
        <Box flexGrow={1} height={'60%'}>
            <Box mx={12} my={8} height={'90%'}>
                <Text pb={8} textAlign={'center'} fontSize={'2xl'} fontWeight={'bold'}>
                    Project Options:
                </Text>
                {Object.keys(selections).map((key, index) => (
                    <Text flexGrow={1}>
                        <CheckIcon color={'green'} mx={4} /> {<strong>{idMappings[key]}</strong>}: {selections[key]}
                    </Text>
                ))}
            </Box>
        </Box>
    );
};

export default ReviewBox;
