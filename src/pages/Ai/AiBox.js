import React, { useState } from 'react';
import {
    Box,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
} from '@chakra-ui/react';
import TitleDescriptionForm from './TitleDescriptionForm';
import KeyValueForm from './Form';

function AiBox() {
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [serviceData, setServiceData] = useState([{ number: 1, name: 'Sample Service', description: 'Sample Description' }]);

    const steps = [
        { title: 'Application' },
        { title: 'Services' },
    ];

    const { activeStep, setActiveStep } = useSteps({
        initialStep: 0,
        steps: steps.length,
    });

    const handleNextTitleDescription = (data) => {
        setFormData(data);
        setActiveStep(1);
    };

    const handleNextKeyValue = (data) => {
        setServiceData(data);
        setActiveStep(0);
    };

    const handleBack = () => {
        setActiveStep(0);
    };

    return (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <Stepper size="md" index={activeStep} style={{ marginBottom: '20px' }}>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepIndicator>
                            <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
                        </StepIndicator>

                        <Box flexShrink="0">
                            <StepTitle>{step.title}</StepTitle>
                        </Box>

                        <StepSeparator />
                    </Step>
                ))}
            </Stepper>

            <Box
                w="900px"
                h="600px"
                p={6}
                bg="white"
                rounded="xl"
                boxShadow="lg"
                borderColor="gray.300"
                borderWidth="1px"
            >
                {activeStep === 0 && (
                    <TitleDescriptionForm
                        title={formData.title}
                        description={formData.description}
                        onNext={handleNextTitleDescription}
                    />
                )}
                {activeStep === 1 && (
                    <KeyValueForm
                        serviceData={serviceData}
                        setServiceData={setServiceData}
                        onNext={handleNextKeyValue}
                        onBack={handleBack}
                        title={formData.title}
                    />
                )}
            </Box>
        </div>
    );
}

export default AiBox;
