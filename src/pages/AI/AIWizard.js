import React, { useState, useEffect } from 'react';
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
    Spinner,
} from '@chakra-ui/react';
import TitleDescriptionForm from './TitleDescriptionForm';
import ServiceForm from './Form';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useKeycloak } from '@react-keycloak/web';

function AiBox() {
    const { initialized, keycloak } = useKeycloak();
    const history = useHistory();
    const [formData, setFormData] = useState({ title: '', description: '', id: '' });
    const [serviceData, setServiceData] = useState();
    const [projectParentId, setProjectParentId] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialized && keycloak?.authenticated) {
            let defaultProjectId;
            fetch(process.env.REACT_APP_API_BASE_URL + '/api/projects', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
            })
                .then(response => response.json())
                .then(result => {
                    if (result?.data) {
                        defaultProjectId = result.data.find(project => project.name.startsWith('default'))?.id;
                        if (!defaultProjectId) {
                            fetch(process.env.REACT_APP_API_BASE_URL + '/api/projects', {
                                method: 'post',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                                },
                                body: JSON.stringify({
                                    name: 'default',
                                    description: 'Default Project',
                                }),
                            })
                                .then(response => response.json())
                                .then(result => {
                                    if (result?.data) {
                                        defaultProjectId = result.data.id;
                                        setProjectParentId(defaultProjectId);
                                    }
                                })
                                .catch(error => console.error(error));
                        } else {
                            setProjectParentId(defaultProjectId);
                        }
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [initialized, keycloak?.realmAccess?.roles, keycloak?.token]);

    const steps = [{ title: 'Application' }, { title: 'Services' }];

    const { activeStep, setActiveStep } = useSteps({
        initialStep: 0,
        steps: steps.length,
    });

    const handleNextTitleDescription = async data => {
        setLoading(true); 
        if (formData?.id && formData.id !== '') {
            data.id = formData.id;
        }
        await fetch(process.env.REACT_APP_AI_CORE_URL + '/requirements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(result => {
                setFormData(prev => ({
                    ...prev,
                    title: data.title,
                    description: data.description,
                    id: result.id,
                }));
                setServiceData(result.services);
                setLoading(false); 
                setActiveStep(1);
            })
            .catch(error => console.error(error));
    };

    const handleSubmit = async data => {
        try {
            setServiceData(data);
            const requirementData = {
                title: formData.title,
                description: formData.description,
                services: data,
            };

            const { blueprintId, defaultProjectId } = await UpdateRequirementData(requirementData);
            history.push({
                pathname: `/project/${defaultProjectId}/architecture/${blueprintId}/edit`,
                state:{ai: true}
            });
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };

    const UpdateRequirementData = async (requirementData) => {
        try {
            setLoading(true); 
            const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/dynamic-template', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
                body: JSON.stringify(requirementData),
            });
            if (!response.ok) {
                console.error('response was not ok');
            }
            const data = await response.json();
            setLoading(false); 
            return { blueprintId: data.blueprintId,defaultProjectId:data.defaultProjectId };
        } catch (error) {
            console.error('Error occurred while saving combined data:', error);
            setLoading(false);
            history.push('/aiwizard')
        }
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
    
            {loading ? (
                <div
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <Spinner size="xl" style={{marginBottom:'50px',color:'orange'}}/>
                    <div style={{ marginBottom: '-150px',width:'350px' }}>
                    {activeStep === 0 ? `Services are currently being built. Please wait for a few minutes.`:`Your architecture is being built. Please wait for a few minutes.`}
                    </div>
                </div>
            ) : (
                <Box w="900px" h="600px" p={6} bg="white" rounded="xl" boxShadow="lg" borderColor="gray.300" borderWidth="1px">
                    {activeStep === 0 && (
                        <TitleDescriptionForm title={formData.title} description={formData.description} refresh={formData?.id!=''} onNext={handleNextTitleDescription} />
                    )}
                    {activeStep === 1 && (
                        <ServiceForm
                            serviceData={serviceData}
                            setServiceData={setServiceData}
                            onNext={handleSubmit}
                            onBack={handleBack}
                            title={formData.title}
                        />
                    )}
                </Box>
            )}
        </div>
    );
    
}

export default AiBox;
