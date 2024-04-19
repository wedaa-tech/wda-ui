import React, { useEffect, useState } from 'react';
import { useReactFlow } from 'reactflow';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Button } from '@chakra-ui/react';

const Deployment = ({ deploymentData, onSubmit, generateZip, parentId }) => {
    let generateCodeButton = (
        <Button
            mx={4}
            my={2}
            colorScheme="blue"
            onClick={() => {
                onSubmit(deploymentData, true);
            }}
            hidden={parentId=='admin'}
            minH={'48px'}
            flexGrow={1} 
            style={{ position: 'absolute', bottom: "12px",width:'85%' }} // Set position to bottom
        >
            Generate Code
        </Button>
    );

    if (!deploymentData?.deployment) {
        return (
            <>
                <Box p={4}>Deployment Data Not Found.</Box>
                {generateCodeButton}
            </>
        );
    } else {
        return (
            <>
                <Box display="flex" flexDirection="column" position="relative">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Property</Th>
                                <Th>Value</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {Object.keys(deploymentData.deployment).map(key => (
                                <Tr key={key}>
                                    <Td>{key}</Td>
                                    <Td>{deploymentData.deployment[key]}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
                {generateCodeButton}
            </>
        );
    }
};

export default Deployment;
