import React, { useState } from 'react';
import {
    Box,
    Button,
    Flex,
    Grid,
    Step,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    Text,
    VStack,
    useSteps,
} from '@chakra-ui/react';
import './index.css';
import WizardBox from './WizardBox';
import { ArrowBackIcon, ArrowForwardIcon, CheckIcon } from '@chakra-ui/icons';
import ReviewBox from './ReviewBox';

const questionsData = {
    ArchList: {
        question: 'Choose an architecture type',
        id: 'AT',
        type: 'radio',
        options: { 'Full Stack': [0, 1, 2], Microservices: [0], Serverless: [2], 'Event-Driven': [1] },
    },
    questionsList: {
        0: {
            question: 'Select a frontend framework',
            id: 'FE',
            type: 'radio',
            options: ['React', 'Angular', 'Vue'],
        },
        1: {
            question: 'Select a backend framework',
            id: 'BE',
            type: 'radio',
            options: ['Spring Boot', 'Go Micro'],
        },
        2: {
            question: 'Select a database',
            id: 'DB',
            type: 'radio',
            options: ['PostgreSQL', 'MongoDB'],
        },
    },
};

const idMappings = {
    AT: 'Archtecture Type',
    FE: 'Frontend',
    BE: 'Backend',
    DB: 'Database',
};

function Wizard() {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({ AT: null });
    const [selectedArch, setSelectedArch] = useState(undefined);
    const { ArchList, questionsList } = questionsData;
    const [review, setReview] = useState(false);

    const currentQuestion = questionsList[ArchList.options[selectedAnswers.AT]?.[currentStep]];

    const handleNext = () => {
        if (!selectedArch) {
            setSelectedArch(selectedAnswers.AT);
            setCurrentStep(0);
        } else if (currentStep < Object.keys(ArchList.options[selectedAnswers.AT]).length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setReview(true);
            console.log(selectedAnswers)
        }
    };

    const handleBack = () => {
        if (review) setReview(false)
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else if (currentStep === 0) {
            setCurrentStep(0);
            setSelectedArch(undefined);
        }
    };

    const handleCheckboxChange = option => {
        let newSelectedAnswers = { ...selectedAnswers };
        if (!selectedArch) {
            newSelectedAnswers = { AT: option };
        } else {
            newSelectedAnswers[currentQuestion.id] = option;
        }
        setSelectedAnswers(newSelectedAnswers);
    };

    const { activeStep, setActiveStep } = useSteps({
        index: 1,
        count: Object.keys(selectedAnswers.AT ? ArchList.options[selectedAnswers.AT] : {}).length,
    });

    return (
        <>
            <Flex direction={'column'} justifyContent={'space-evenly'} alignItems={'center'} className="pageBox">
                {selectedArch && (
                    <Stepper width={'70%'} size="md" index={currentStep}>
                        {ArchList.options[selectedArch].map((question, index) => (
                            <Step key={index} onClick={() => setActiveStep(index)}>
                                <StepIndicator>
                                    <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
                                </StepIndicator>

                                <Box flexShrink="0">
                                    <StepTitle>{questionsList[question].question}</StepTitle>
                                </Box>

                                <StepSeparator />
                            </Step>
                        ))}
                    </Stepper>
                )}
                <Flex border={'1px solid #d6d6d6'} flexDirection={'column'} boxShadow="2xl" rounded="xl" height={'60%'} width={'50%'}>
                    {review ? (
                        <ReviewBox idMappings={idMappings} selections={selectedAnswers}/>
                    ) : (
                        <WizardBox
                            currentQuestion={selectedArch ? currentQuestion : ArchList}
                            handleCheckboxChange={handleCheckboxChange}
                            archSelect={!selectedArch}
                            selectedAnswer={selectedAnswers[selectedArch ? currentQuestion.id : 'AT']}
                        />
                    )}
                    <Flex padding={'30px'} justifyContent={'space-between'}>
                        <Button isDisabled={!selectedArch} rightIcon={<ArrowBackIcon />} onClick={handleBack} colorScheme="blue">
                            Back
                        </Button>
                        <Button
                            isDisabled={!selectedAnswers[selectedArch ? currentQuestion.id : 'AT']}
                            rightIcon={<ArrowForwardIcon />}
                            onClick={handleNext}
                            colorScheme="blue"
                        >
                            Next
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </>
    );
}

export default Wizard;
