import React, { useEffect, useState } from 'react';
import { useReactFlow } from 'reactflow';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Text } from '@chakra-ui/react';

const CreditView = ({ deploymentData, onSubmit, generateZip, parentId }) => {
    const aiServiceData = [];
    Object.keys(deploymentData.services).forEach(key => {
        const id = deploymentData.services[key].Id;
        var applicationFramework = deploymentData.services[key].applicationFramework;
        var dbmlData = deploymentData.services[key]?.dbmlData;
        var description = deploymentData.services[key]?.description;
        if (id.startsWith('Service') && applicationFramework == 'spring' && dbmlData && description) {
            var label = `${deploymentData.services[key].applicationName}`;
            aiServiceData.push({ label: label, value: 1 });
        }
    });

    return (
        <>
            <Box display="flex" flexDirection="column" position="relative">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Service</Th>
                            <Th>Credits</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {aiServiceData.map((service, index) => (
                            <Tr key={index}>
                                <Td>{service.label}</Td>
                                <Td style={{ paddingLeft: '40px' }}>{service.value}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
            {aiServiceData.length > 0 && (
                <Text style={{ position: 'absolute', bottom: '10%', left: '8%', fontSize: '15px',color:'red' }}>
                    * This Prototype Utilizes {aiServiceData.length} {aiServiceData.length>1 ? 'Credits':'Credit'} for the code Generation
                </Text>
            )}
        </>
    );
};

export default CreditView;
