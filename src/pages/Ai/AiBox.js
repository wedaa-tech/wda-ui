import React, { useState } from 'react';
import {
    Box,
    Step,
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
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function AiBox() {
    const history = useHistory();
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [serviceData, setServiceData] = useState([{ number: 1, name: 'Sample Service', description: 'Sample Description' }]);
    const [combinedData, setCombinedData] = useState({ title: '', description: '', services: [] });

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

    const handleSubmit = (data) => {
        setServiceData(data);
        const combinedData = {
            title: formData.title,
            description: formData.description,
            services: data
        };
        setCombinedData(combinedData);
        console.log("hii",combinedData,)
        fetch(process.env.REACT_APP_API_BASE_URL + '/dynamic-template', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(combinedData),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data,"lolol")
                history.push({
                    pathname: '/canvastocode',
                    state: { metadata: data },
                });
            })
            .catch(error => console.error('Error occured:', error));
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
                        onNext={handleSubmit}
                        onBack={handleBack}
                        title={formData.title}
                    />
                )}
            </Box>
        </div>
    );
}

export default AiBox;
