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
import KeyValueForm from './Form';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useKeycloak } from '@react-keycloak/web';

function AiBox() {
    const { initialized, keycloak } = useKeycloak();
    const history = useHistory();
    const [formData, setFormData] = useState({ title: '', description: '', id: '' });
    const [serviceData, setServiceData] = useState();
    const [combinedData, setCombinedData] = useState({ title: '', description: '', services: [] });
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
        console.log("hi")
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
                console.log("result",result)
                setFormData(prev => ({
                    ...prev,
                    title: data.title,
                    description: data.description,
                    id: result.id,
                }));
                setServiceData(result.services);
                console.log("data recieved",serviceData,formData)
                setLoading(false); 
                setActiveStep(1);
            })
            .catch(error => console.error(error));
        // setServiceData([
        //     {
        //       "name": "User Management",
        //       "description": "Handles user registration, authentication, and authorization for the health care system."
        //     },
        //     {
        //       "name": "Appointmen",
        //       "description": "Allows users to schedule appointments with healthcare providers and manages the appointment calendar."
        //     },
        //     {
        //       "name": "Health Records",
        //       "description": "Stores and manages patients' medical records, including diagnoses, treatments, and test results."
        //     },
        //     {
        //       "name": "Billing and Payment",
        //       "description": "Handles billing and payment processing for healthcare services provided to patients."
        //     },
        //     {
        //       "name": "Pharmacy Management",
        //       "description": "Manages medication inventory, prescription orders, and dispensing for patients."
        //     },
        //     {
        //       "name": "Telemedicine",
        //       "description": "Enables remote consultations and medical services through video calls and messaging."
        //     },
        //     {
        //       "name": "Analytics",
        //       "description": "Generates reports and provides insights on healthcare system performance, patient outcomes, and resource utilization."
        //     },
        //     {
        //       "name": "Inventory Management",
        //       "description": "Tracks and manages medical supplies, equipment, and consumables within the healthcare system."
        //     }
        //   ]);
    };

    // const handleSubmit = async(data) => {
    //     setServiceData(data);
    //     const combinedData = {
    //         title: formData.title,
    //         description: formData.description,
    //         services: data,
    //     };
    //     setCombinedData(combinedData);
    //     console.log('hii', combinedData);
    //     var projectId
    //     var metaData
    //     await fetch(process.env.REACT_APP_API_BASE_URL + '/api/dynamic-template', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
    //         },
    //         body: JSON.stringify(combinedData),
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log(data, 'lolol');
    //             projectId = data.blueprintId
    //             metaData = data
    //             // history.push({
    //             //     pathname: '/canvastocode',
    //             //     state: { metadata: data },
    //             // });
    //         })
    //         .catch(error => console.error('Error occured:', error));

    //         const requirementUpdatedData ={
    //            title:formData.title,
    //            description:formData.description,
    //            services:serviceData,
    //            blueprintId:projectId
    //         }

    //         fetch(process.env.REACT_APP_API_BASE_URL + `/api/requirements/${formData._id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
    //             },
    //             body: JSON.stringify(requirementUpdatedData),
    //         })
    //         console.log(metaData,"ppppppp")

    //          history.push({
    //                 pathname: '/canvastocode',
    //                 state: { metadata: metaData.metadata },
    //             });

    // };

    const handleSubmit = async data => {
        try {
            setServiceData(data);

            const combinedData = {
                title: formData.title,
                description: formData.description,
                services: data,
            };
            setCombinedData(combinedData);
            console.log('Combined Data:', combinedData);

            const { blueprintId, defaultProjectId } = await saveCombinedData(combinedData);
            console.log(blueprintId,defaultProjectId)
            // const requirementUpdatedData = {
            //     title: formData.title,
            //     description: formData.description,
            //     services: serviceData,
            //     blueprintId: projectId
            // };

            // updateRequirements(formData._id, requirementUpdatedData);
            history.push({
                pathname: `/project/${defaultProjectId}/architecture/${blueprintId}/edit`,
                state:{ai: true}
            });
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };

    // const saveCombinedData = async combinedData => {
    //     try {
    //         const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/dynamic-template', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
    //             },
    //             body: JSON.stringify(combinedData),
    //         });
    //         if (!response.ok) {
    //             console.error('response was not ok');
    //         }
    //         const data = await response.json();
    //         return { projectId: data.project_id };
    //     } catch (error) {
    //         console.error('Error occurred while saving combined data:', error);
    //     }
    // };

    const saveCombinedData = async (combinedData) => {
        try {
            setLoading(true); 
            const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/dynamic-template', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
                body: JSON.stringify(combinedData),
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
            history.push('/aibox')
        }
    };
    

    // const updateRequirements = async (id, requirementUpdatedData) => {
    //     try {
    //         const response = await fetch(process.env.REACT_APP_API_BASE_URL + `/api/requirements/${id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
    //             },
    //             body: JSON.stringify(requirementUpdatedData),
    //         });
    //         await response.json();
    //     } catch (error) {
    //         console.error('Error occurred while updating requirements:', error);
    //     }
    // };

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
                    <Spinner size="xl" style={{marginBottom:'40px',color:'orange'}}/>
                    <div style={{ marginBottom: '-100px' }}>Your architecture is being built. Please wait for a few minutes.</div>
                </div>
            ) : (
                <Box w="900px" h="600px" p={6} bg="white" rounded="xl" boxShadow="lg" borderColor="gray.300" borderWidth="1px">
                    {activeStep === 0 && (
                        <TitleDescriptionForm title={formData.title} description={formData.description} onNext={handleNextTitleDescription} />
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
            )}
        </div>
    );
    
}

export default AiBox;
