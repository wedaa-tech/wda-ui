import React, { useEffect, useState } from 'react';
import { useReactFlow } from 'reactflow';
import { Table, Thead, Tbody, Tr, Th, Td, Box } from '@chakra-ui/react';

const Deployement = ({ deployementData }) => {
    if (!deployementData?.deployement) {
        return <Box p={4}>Deployement Data Not Found.</Box>;
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
                    {Object.keys(deployementData.deployement).map(key => (
                        <Tr key={key}>
                            <Td>{key}</Td>
                            <Td>{deployementData.deployement[key]}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        );
    }
};

export default Deployement;
