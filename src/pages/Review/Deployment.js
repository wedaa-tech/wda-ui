import React, { useEffect, useState } from 'react';
import { useReactFlow } from 'reactflow';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Button } from '@chakra-ui/react';

const Deployment = ({ deploymentData, onSubmit, generateZip, parentId,handleRefArch,adminView }) => {
    let generateCodeButton = (
        <Box position="absolute" bottom="12px" width="85%" display="flex" gap={4} mx={4} my={2}>
        <Button
            colorScheme="blue"
            onClick={() => {
                onSubmit(deploymentData, true);
            }}
            hidden={parentId === 'admin'}
            minH="48px"
            flexGrow={1}
        >
            Generate Code
        </Button>
        <Button
            colorScheme="blue"
            hidden={parentId === 'admin'|| !adminView}
            onClick={() => {
                handleRefArch(deploymentData);
            }}
            minH="48px"
            flexGrow={1}
        >
            Publish as RefArch
        </Button>
    </Box>
    
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
