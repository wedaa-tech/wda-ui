import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Button,
    Flex,
    Step,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
    useToast,
} from '@chakra-ui/react';
import './index.css';
import WizardBox from './WizardBox';
import { ArrowBackIcon, ArrowForwardIcon, CheckIcon, CloseIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import ReviewBox from './ReviewBox';
import design2 from '../../assets/markets/design2.png';

import { idMappings, imageMappings, questionsData } from './CONSTANTS';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function WizardSelection() {
    const history = useHistory();
    const sharedSelectedArch = history.location.state;
    const [selectedAnswers, setSelectedAnswers] = useState({ AT: sharedSelectedArch });
    const [selectedArch, setSelectedArch] = useState(sharedSelectedArch);
    const [selectedArchQuestions, setSelectedArchQuestions] = useState(
        sharedSelectedArch ? questionsData.ArchList.options[sharedSelectedArch] : {},
    );
    const { ArchList, questionsList } = questionsData;
    const [review, setReview] = useState(false);
    const count = Object.keys(selectedAnswers.AT ? ArchList.options[selectedAnswers.AT] : {}).length;

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: count,
    });

    useEffect(() => {
        const images = Object.values(imageMappings);
        images.forEach(image => {
            new Image().src = image;
        });
    }, []);

    const currentQuestion = questionsList[ArchList.options[selectedAnswers.AT]?.[activeStep]];

    const toast = useToast({
        containerStyle: {
            width: '500px',
            maxWidth: '100%',
        },
    });
    const toastIdRef = useRef();

    const handleNext = () => {
        if (review) return;
        else if (!selectedArch) {
            setSelectedArch(selectedAnswers.AT);
            setActiveStep(0);
        } else if (activeStep < count - 1) {
            setActiveStep(activeStep + 1);
        } else {
            if (Object.keys(selectedAnswers).length === count + 1) {
                setReview(true);
                setActiveStep(activeStep + 1);
            } else {
                const errorMessage = 'Please Configure all components';
                toast.close(toastIdRef.current);
                toastIdRef.current = toast({
                    title: errorMessage,
                    status: 'error',
                    duration: 3000,
                    variant: 'left-accent',
                    isClosable: true,
                });
            }
        }
    };

    const handleBack = () => {
        if (review) setReview(false);
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        } else if (activeStep === 0) {
            setActiveStep(0);
            setSelectedArch(undefined);
        }
    };

    const handleSubmit = () => {
        fetch(process.env.REACT_APP_API_BASE_URL + '/wizard-template', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedAnswers),
        })
            .then(response => response.json())
            .then(data => {
                history.push({
                    pathname: '/canvastocode',
                    state: { metadata: data },
                });
            })
            .catch(error => console.error('Error occured:', error));
    };

    const handleCheckboxChange = option => {
        let newSelectedAnswers = { ...selectedAnswers };
        if (!selectedArch) {
            newSelectedAnswers = { AT: option };
            setSelectedArchQuestions(questionsData.ArchList.options[option]);
        } else {
            newSelectedAnswers[currentQuestion.id] = option;
        }
        setSelectedAnswers(newSelectedAnswers);
    };

    const checkBoxStatus = stepContext => {
        if (!selectedAnswers[selectedArchQuestions[stepContext.index]]) return <CloseIcon />;
        else return <CheckIcon />;
    };

    return (
        <Flex direction={'column'} justifyContent={'space-evenly'} alignItems={'center'} className="pageBox">
            {selectedArch && (
                <Stepper justifyContent={'center'} width={'70%'} size="md" colorScheme="blue" index={activeStep}>
                    {ArchList.options[selectedArch].map((question, index) => (
                        <Step
                            key={index}
                            onClick={() =>
                                (count === activeStep && setReview(false)) ||
                                (Object.keys(selectedAnswers).length - 1 >= index && setActiveStep(index))
                            }
                        >
                            <StepIndicator>
                                <StepStatus complete={checkBoxStatus} incomplete={<StepNumber />} active={<StepNumber />} />
                            </StepIndicator>

                            <Box flexShrink="0">
                                <StepTitle>{idMappings[questionsList[question].id]}</StepTitle>
                            </Box>

                            <StepSeparator />
                        </Step>
                    ))}
                </Stepper>
            )}
            <Flex border={'1px solid #d6d6d6'} flexDirection={'column'} boxShadow="2xl" rounded="xl" height={'60%'} width={'50%'}>
                {review ? (
                    <ReviewBox idMappings={idMappings} selections={selectedAnswers} />
                ) : (
                    <WizardBox
                        currentQuestion={selectedArch ? currentQuestion : ArchList}
                        handleCheckboxChange={handleCheckboxChange}
                        archSelect={!selectedArch}
                        selectedAnswer={selectedAnswers[selectedArch ? currentQuestion.id : 'AT']}
                        componentId={selectedArch ? 'components' : 'archt'}
                    />
                )}
                <Flex padding={'30px'} justifyContent={'space-between'}>
                    <Button
                        rightIcon={<ArrowBackIcon />}
                        onClick={
                            selectedArch
                                ? activeStep > 0
                                    ? handleBack
                                    : () => {
                                          history.push('/wizard#arch-selection');
                                      }
                                : () => {
                                      history.push('/wizard');
                                  }
                        }
                        colorScheme="blue"
                    >
                        Back
                    </Button>
                    <Button
                        isDisabled={
                            activeStep === count && count !== 0 ? false : !selectedAnswers[selectedArch ? currentQuestion?.id : 'AT']
                        }
                        rightIcon={activeStep === count && count !== 0 ? <ExternalLinkIcon /> : <ArrowForwardIcon />}
                        onClick={activeStep === count && count !== 0 ? handleSubmit : handleNext}
                        colorScheme="blue"
                    >
                        {activeStep === count && count !== 0 ? 'Go to Canvas' : 'Next'}
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default WizardSelection;
