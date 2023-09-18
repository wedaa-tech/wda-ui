import React, { useEffect, useState } from 'react';
import { useReactFlow } from 'reactflow';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Text } from '@chakra-ui/react';

const Deployement = ({ deployementData }) => {
    if (deployementData == null) {
        return <div>Deployement Data Not Found.</div>;
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
                    {Object.keys(deployementData).map(key => (
                        <Tr key={key}>
                            <Td>{key}</Td>
                            <Td>{deployementData[key]}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        );
    }
};

export default Deployement;
