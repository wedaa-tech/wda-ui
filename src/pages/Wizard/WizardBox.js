import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, useRadio, useRadioGroup, SimpleGrid, Image } from '@chakra-ui/react';
import { imageMappings, componentsMapping } from './CONSTANTS';
import './WizardBox.css';

function RadioCard(props) {
    const { getInputProps, getRadioProps } = useRadio(props);

    const input = getInputProps();
    const checkbox = getRadioProps();

    return (
        <Box as="label" maxH={'250px'}>
            <input {...input} />
            <Box
                minW={'250px'}
                {...checkbox}
                className="wizard-checkbox"
                cursor="pointer"
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
                display="flex"
                alignItems="center"
                justifyContent={'center'}
                _checked={{
                    borderWidth: '4px',
                    borderColor: 'blue.600',
                }}
                _hover={{
                    borderWidth: '4px',
                    borderColor: 'blue.400',
                }}
            >
                {imageMappings[props.value] && (
                    <Image
                        objectFit={'contain'}
                        aspectRatio={5 / 2}
                        maxW={'240px'}
                        mixBlendMode={'multiply'}
                        src={imageMappings[props.value]}
                    ></Image>
                )}
                {!imageMappings[props.value] && <Text className="not-selectable arch-image-text">{componentsMapping[props.children]}</Text>}
            </Box>
        </Box>
    );
}

function WizardBox({ currentQuestion, handleCheckboxChange, archSelect = false, selectedAnswer, componentId = null }) {
    const { question, type, id, options } = currentQuestion;
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
        <Box flexGrow={1} height={'60%'} rounded="xl">
            <VStack spacing={4} my={8} height={'90%'}>
                <Text fontSize="lg">{question}</Text>
                <SimpleGrid
                    className={'wizard-grid ' + componentId}
                    flexGrow={1}
                    alignContent={'center'}
                    columns={{ sm: 2, md: 2 }}
                    spacingX={28}
                    spacingY={10}
                    {...group}
                    overflowY={'scroll'}
                    minWidth={'200px'}
                >
                    {optionsList.map(value => {
                        const radio = getRadioProps({ value });
                        return (
                            <RadioCard key={id + value} {...radio}>
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
