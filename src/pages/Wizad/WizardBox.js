import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, useRadio, useRadioGroup, SimpleGrid } from '@chakra-ui/react';
import application from '../../assets/archModel/application.png';
import './index.css';

function RadioCard(props) {
    const { getInputProps, getRadioProps } = useRadio(props);

    const input = getInputProps();
    const checkbox = getRadioProps();

    return (
        <Box as="label">
            <input {...input} />
            <Box
                minW={'250px'}
                {...checkbox}
                className="wizard-checkbox"
                bgImage={application}
                cursor="pointer"
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
                _checked={{
                    borderWidth: '4px',
                    borderColor: 'blue.600',
                }}
                _hover={{
                    borderWidth: '4px',
                    borderColor: 'blue.400',
                }}
            >
                <Text className="not-selectable image-text">{props.children}</Text>
            </Box>
        </Box>
    );
}

function WizardBox({ currentQuestion, handleCheckboxChange, archSelect = false, selectedAnswer }) {
    const { question, type, id, options } = currentQuestion;

    console.log(currentQuestion, archSelect, selectedAnswer);

    const [optionsList, setOptionsList] = useState([]);

    useEffect(() => {
        if (archSelect) {
            const optslst = [...Object.keys(options)];
            setOptionsList(optslst);
        } else {
            setOptionsList(options);
        }
    }, [archSelect, options]);

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: question,
        value: !selectedAnswer ? null : selectedAnswer,
        onChange: handleCheckboxChange,
    });

    const group = getRootProps();

    return (
        <Box flexGrow={1} height={'60%'}>
            <VStack spacing={4} my={8} height={'90%'}>
                <Text fontSize="lg">{question}</Text>
                <SimpleGrid className="wizard-grid" py={10} columns={2} spacingX={28} spacingY={10} {...group} overflowY={'scroll'}>
                    {optionsList.map(value => {
                        const radio = getRadioProps({ value });
                        return (
                            <RadioCard key={value} {...radio}>
                                {value}
                            </RadioCard>
                        );
                    })}
                </SimpleGrid>
            </VStack>
        </Box>
    );
}

export default WizardBox;
