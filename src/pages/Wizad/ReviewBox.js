import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { CheckIcon, NotAllowedIcon } from '@chakra-ui/icons';
import { componentsMapping } from './CONSTANTS';

const ReviewBox = ({ selections, idMappings }) => {
    return (
        <Box flexGrow={1} height={'60%'}>
            <Box mx={12} my={8} height={'90%'}>
                <Text pb={8} textAlign={'center'} fontSize={'2xl'} fontWeight={'bold'}>
                    Project Options:
                </Text>
                {Object.keys(selections).map((key, index) => (
                    <Text flexGrow={1} my={2}>
                        {selections[key] === 'skip' ? <NotAllowedIcon color={'gray'} mx={4} /> : <CheckIcon color={'green'} mx={4} />}
                        {<strong>{idMappings[key]}</strong>}: {componentsMapping[selections[key]]}
                    </Text>
                ))}
            </Box>
        </Box>
    );
};

export default ReviewBox;
