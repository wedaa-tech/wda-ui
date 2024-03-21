import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Code } from '@chakra-ui/react';
import React from 'react';

const AccordionComponent = ({ data,nodesList,setNodesList,dbmlMode }) => {
    return (
        <Accordion onChange={(indices) => setNodesList(indices)} defaultIndex={[0]} index={nodesList} allowMultiple>
            {Object.entries(data).map(([label, content]) => (
                <AccordionItem key={label}>
                    <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                            {content.label}
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                        <Code
                            style={{
                                whiteSpace: 'pre',
                                width: '100%',
                            }}
                        >
                            {dbmlMode ? String.raw`${content.value}`:JSON.stringify(content.value, null, 4)}
                        </Code>
                    </AccordionPanel>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default AccordionComponent;