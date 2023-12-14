import React, { useEffect, useState } from 'react';
import { useReactFlow } from 'reactflow';
import { Table, Thead, Tbody, Tr, Th, Td, Box } from '@chakra-ui/react';

const Deployment = ({ deploymentData }) => {
    if (!deploymentData?.deployment) {
        return <Box p={4}>Deployment Data Not Found.</Box>;
    } else {
        return (
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
        );
    }
};

export default Deployment;
