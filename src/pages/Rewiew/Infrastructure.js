import { Alert, AlertIcon, Box, Button, Flex, FormControl, FormLabel, HStack, Image, Input, Select, Text, Divider } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import azure from '../../../src/assets/Azure.png';
import aws from '../../../src/assets/aws.png';
import minikube from '../../assets/minikube.png';
import none from '../../assets/none-icon.jpg';

const Infrastructure = ({ onSubmit, projectData, generateZip }) => {
    const [selectedImage, setSelectedImage] = useState('none');
    const [checkLength, setCheckLength] = useState(false);
    const [DeploymentData, setDeploymentData] = useState({});
    const [userData, setUserData] = useState({});
    useEffect(() => {
        let data = {};
        if (localStorage?.data !== undefined && localStorage.data !== null && JSON.parse(localStorage.data)?.metadata?.deployment !== '') {
            data = JSON.parse(localStorage.data);
        }
        if (data && data.metadata?.deployment) {
            setUserData(data);
            setSelectedImage(data.metadata.deployment.cloudProvider);
            setDeploymentData(data.metadata.deployment);
        }
    }, []);

    useEffect(() => {
        let data = {
            metadata: {},
        };
        if (localStorage?.data?.metadata) {
            data = JSON.parse(localStorage.data);
            if (Object.keys(DeploymentData).length >= 1) data.metadata.deployment = DeploymentData;
            localStorage.data = JSON.stringify(data);
            setUserData(data);
        } else {
            if (Object.keys(DeploymentData).length >= 1) data.metadata.deployment = DeploymentData;
            localStorage.data = JSON.stringify(data);
            setUserData(data);
        }
    }, [DeploymentData]);

    const isCheckEmpty = () => {
        if (DeploymentData.cloudProvider === 'azure') {
            return (
                DeploymentData.deploymentType === '' ||
                DeploymentData.clusterName === '' ||
                DeploymentData.kubernetesNamespace === '' ||
                DeploymentData.monitoring === '' ||
                // DeploymentData.ingressDomain === "" ||
                DeploymentData.k8sWebUI === ''
            );
        } else if (DeploymentData.cloudProvider === 'aws') {
            if (DeploymentData.kubernetesUseDynamicStorage === 'true') {
                return (
                    DeploymentData.kubernetesStorageClassName === '' ||
                    DeploymentData.awsAccountId === '' ||
                    DeploymentData.awsRegion === '' ||
                    DeploymentData.deploymentType === '' ||
                    DeploymentData.clusterName === '' ||
                    DeploymentData.kubernetesNamespace === '' ||
                    DeploymentData.monitoring === '' ||
                    DeploymentData.k8sWebUI === ''
                );
            }
            return (
                DeploymentData.awsAccountId === '' ||
                DeploymentData.awsRegion === '' ||
                DeploymentData.deploymentType === '' ||
                DeploymentData.clusterName === '' ||
                DeploymentData.kubernetesNamespace === '' ||
                DeploymentData.monitoring === '' ||
                // DeploymentData.ingressDomain === "" ||
                DeploymentData.k8sWebUI === ''
            );
        } else {
            return (
                DeploymentData.dockerRepositoryName === '' || DeploymentData.kubernetesNamespace === '' || DeploymentData.monitoring === ''
            );
        }
    };

    const forbiddenWords = [
        'admin',
        'adfs',
        'adsync',
        'api',
        'appgateway',
        'appservice',
        'archive',
        'arm',
        'automation',
        'autoscale',
        'az',
        'azure',
        'batch',
        'bing',
        'biztalk',
        'bot',
        'cdn',
        'cloud',
        'container',
        'cosmos',
        'data',
        'dev',
        'diagnostics',
        'dns',
        'documentdb',
        'edge',
        'eventhub',
        'express',
        'fabric',
        'frontdoor',
        'gateway',
        'graph',
        'hana',
        'health',
        'host',
        'hybrid',
        'insight',
        'iot',
        'keyvault',
        'lab',
        'machinelearning',
        'management',
        'market',
        'media',
        'mobile',
        'ms',
        'msit',
        'my',
        'mysql',
        'network',
        'notification',
        'oms',
        'orchestration',
        'portal',
        'recovery',
        'redis',
        'scheduling',
        'search',
        'server',
        'service',
        'shop',
        'sql',
        'stack',
        'storage',
        'store',
        'stream',
        'support',
        'syndication',
        'trafficmanager',
        'user',
        'virtualnetwork',
        'visualstudio',
        'vm',
        'vpn',
        'vsts',
        'web',
        'webservices',
        'worker',
    ];

    const azureClusterNameCheck = DeploymentData.cloudProvider === 'azure' && forbiddenWords.includes(DeploymentData.clusterName);

    const handleImageClick = image => {
        setSelectedImage(image);

        let ProviderStates;
        if (image === 'aws') {
            ProviderStates = {
                awsAccountId: '',
                awsRegion: '',
                kubernetesStorageClassName: '',
            };
        } else if (image === 'azure') {
            ProviderStates = {
                location: 'canadacentral',
                subscriptionId: '',
                tenantId: '',
            };
        } else if (image === 'minikube') {
            ProviderStates = {
                dockerRepositoryName: '',
            };
        }
        ProviderStates = {
            ...ProviderStates,
            deploymentType: 'kubernetes',
            enableECK: 'false',
            clusterName: '',
            kubernetesUseDynamicStorage: 'true',
            kubernetesNamespace: '',
            ingressType: 'istio',
            monitoring: 'false',
            ingressDomain: '',
            k8sWebUI: 'false',
        };

        setDeploymentData(prevState => ({
            ...prevState,
            cloudProvider: image,
            ...ProviderStates,
        }));
    };

    const handleKeyPress = event => {
        const charCode = event.which ? event.which : event.keyCode;
        if ((charCode >= 48 && charCode <= 57) || charCode === 8) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    };

    const handleBlur = (column, value) => {
        if (column === 'awsAccountId') validateInputValue(value);
        else if (column === 'tenantId') {
            validateAzureInputValue('tenantId', value);
        } else if (column === 'subscriptionId') {
            validateAzureInputValue('subscriptionId', value);
        }
    };
    const handleData = (column, value) => {
        setDeploymentData(prev => ({ ...prev, [column]: value }));
    };

    function handleSubmit(DeploymentData) {
        let FinalData = { ...DeploymentData };

        if (FinalData.cloudProvider === 'aws') {
            delete FinalData?.location;
            delete FinalData?.subscriptionId;
            delete FinalData?.tenantId;
            delete FinalData?.dockerRepositoryName;
        } else if (FinalData.cloudProvider === 'azure') {
            delete FinalData?.awsAccountId;
            delete FinalData?.awsRegion;
            delete FinalData?.kubernetesStorageClassName;
            delete FinalData?.dockerRepositoryName;
        } else {
            delete FinalData?.location;
            delete FinalData?.subscriptionId;
            delete FinalData?.tenantId;
            delete FinalData?.awsAccountId;
            delete FinalData?.awsRegion;
            delete FinalData?.kubernetesStorageClassName;
            delete FinalData?.deploymentType;
            delete FinalData?.clusterName;
            delete FinalData?.ingressDomain;
            delete FinalData?.k8sWebUI;
        }
        if (FinalData.kubernetesUseDynamicStorage === 'false') delete FinalData?.kubernetesStorageClassName;
        if (selectedImage === 'aws') {
            !checkLength && onSubmit({ ...projectData, deployment: FinalData }, true);
        } else if (selectedImage === 'azure') {
            const isAzureInputValid = validateAzureInputValue('subscriptionId', FinalData.subscriptionId);
            const isAzureInputValidField = validateAzureInputValue('tenantId', FinalData.tenantId);
            setValidateSubscriptionIdField(!isAzureInputValid);
            setValidateTenantIdField(!isAzureInputValidField);
            if (isAzureInputValid && isAzureInputValidField) {
                onSubmit({ ...projectData, deployment: FinalData }, true);
            }
        } else {
            onSubmit({ ...projectData, deployment: FinalData }, true);
        }
    }

    const namespaceCheck = /^[a-zA-Z][a-zA-Z0-9-]*$/.test(DeploymentData.kubernetesNamespace);
    const clusterNameCheck = /^[a-zA-Z][a-zA-Z0-9-]*$/.test(DeploymentData.clusterName);
    const storageClassCheck = /^[a-z][a-z]*$/.test(DeploymentData.kubernetesStorageClassName);

    let domainNameCheck = true;
    if (DeploymentData.ingressDomain !== '') {
        domainNameCheck = /^(?!:\/\/)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/.test(DeploymentData.ingressDomain);
    }

    const checkValidation = () => {
        if (selectedImage === 'minikube') return !namespaceCheck;
        else if (selectedImage === 'aws') {
            if (DeploymentData.kubernetesUseDynamicStorage === 'true')
                return !storageClassCheck || !namespaceCheck || !domainNameCheck || !clusterNameCheck;
            else {
                return !namespaceCheck || !domainNameCheck || !clusterNameCheck;
            }
        }
        return (
            !namespaceCheck ||
            !domainNameCheck ||
            !clusterNameCheck ||
            azureClusterNameCheck ||
            validateSubscriptionIdField ||
            validateTenantIdField
        );
    };
    const validateInputValue = value => {
        if (value.length < 12) {
            setCheckLength(true);
        } else setCheckLength(false);
    };
    const [validateSubscriptionIdField, setValidateSubscriptionIdField] = useState(false);
    const [validateTenantIdField, setValidateTenantIdField] = useState(false);

    const validateAzureInputValue = (column, value) => {
        const regexExp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        let isValid = true;

        if (column === 'tenantId') {
            const isValidLength = value.length === 36;
            const isValidFormat = regexExp.test(value);
            isValid = isValidLength && isValidFormat;
            setValidateTenantIdField(!isValid);
        } else if (column === 'subscriptionId') {
            const isValidLength = value.length === 36;
            const isValidFormat = regexExp.test(value);
            isValid = isValidLength && isValidFormat;
            setValidateSubscriptionIdField(!isValid);
        }

        return isValid;
    };

    return (
        <Flex direction={'column'} width={'100%'} h={'100%'}>
            <Text fontSize="md" pt={2} px={8} font="15px">
                Select, Customize and Deploy Your Infrastructure with Ease!
            </Text>
            <Box maxH={'calc(100vh - 242px)'} overflowY={'hidden'} px={4} py={1} flexGrow={1}>
                {/* <Box shadow={'md'}> */}
                <HStack height={'120px'} justifyContent={'space-evenly'}>
                    <Box
                        onClick={() => handleImageClick('minikube')}
                        rounded={'2xl'}
                        // backgroundColor={'#9e9e9e30'}
                        overflow={'hidden'}
                        padding={'7px'}
                        border={` ${selectedImage === 'minikube' ? '2px solid #0fadff' : '1px solid #9e9e9e80'}`}
                    >
                        <Image mixBlendMode={'darken'} height={'70px'} src={minikube} />
                    </Box>
                    <Box
                        onClick={() => handleImageClick('aws')}
                        rounded={'2xl'}
                        // backgroundColor={'#9e9e9e30'}
                        overflow={'hidden'}
                        padding={'7px'}
                        border={` ${selectedImage === 'aws' ? '2px solid #0fadff' : '1px solid #9e9e9e80'}`}
                    >
                        <Image mixBlendMode={'darken'} height={'70px'} src={aws} />
                    </Box>
                    <Box
                        onClick={() => handleImageClick('azure')}
                        rounded={'2xl'}
                        // backgroundColor={'#9e9e9e30'}
                        overflow={'hidden'}
                        padding={'7px'}
                        border={`${selectedImage === 'azure' ? '2px solid #0fadff' : '1px solid #9e9e9e80'}`}
                    >
                        <Image mixBlendMode={'darken'} height={'70px'} src={azure} />
                    </Box>
                    <Box
                        onClick={() => handleImageClick('none')}
                        rounded={'2xl'}
                        // backgroundColor={'#9e9e9e30'}
                        overflow={'hidden'}
                        padding={'7px'}
                        border={`${selectedImage === 'none' ? '2px solid #0fadff' : '1px solid #9e9e9e80'}`}
                    >
                        <Image mixBlendMode={'darken'} height={'70px'} src={none} />
                    </Box>
                </HStack>
                {/* </Box> */}
                {selectedImage === 'none' ? (
                    <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
                        <Text fontWeight="bold" mb={2}>
                            Minikube:
                        </Text>
                        <Text pl={2}>
                            Generate application code and scripts to set up and execute the generated application on a single-node
                            Kubernetes cluster running on your local machine. Minikube is a tool that facilitates the setup of a Kubernetes
                            environment on a local PC or laptop.
                        </Text>

                        <Divider my={2} />

                        <Text fontWeight="bold" mb={2}>
                            AWS:
                        </Text>
                        <Text pl={2}>
                            Generate application code and Terraform scripts to deploy and operate the generated application on AWS Elastic
                            Kubernetes Service (EKS). EKS is a managed container orchestration service offered by Amazon Web Services (AWS).
                        </Text>

                        <Divider my={2} />

                        <Text fontWeight="bold" mb={2}>
                            AZURE:
                        </Text>
                        <Text pl={2}>
                            Generate application code and Terraform scripts to deploy and manage the generated application on Microsoft
                            Azure Kubernetes Service (AKS). AKS is a managed container orchestration service offered by Microsoft Azure.
                        </Text>

                        <Divider my={2} />

                        <Text fontWeight="bold" mb={3}>
                            None:
                        </Text>
                        <Text pl={2}>
                            Generate application code and Docker scripts for setting up and running the generated application on your local
                            system. Infrastructure deployment scripts are excluded from this scope.
                        </Text>
                    </Box>
                ) : (
                    <Box px={2} overflowY={'auto'} h={'calc(100vh - 380px)'}>
                        {selectedImage === 'azure' && (
                            <div>
                                <FormControl>
                                    <FormLabel className="required">Subscription Id</FormLabel>
                                    <Input
                                        mb={4}
                                        variant="outline"
                                        id="subscriptionId"
                                        borderColor={'black'}
                                        maxLength="36"
                                        value={DeploymentData.subscriptionId}
                                        onChange={e => handleData('subscriptionId', e.target.value)}
                                        onBlur={e => handleBlur('subscriptionId', e.target.value)}
                                    ></Input>
                                </FormControl>
                                {validateSubscriptionIdField && (
                                    <>
                                        {DeploymentData.subscriptionId.length < 36 ? (
                                            <Alert status="error" height="12px" fontSize="12px" borderRadius="3px" mb={2}>
                                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                                Input value must be at least 36 characters
                                            </Alert>
                                        ) : (
                                            <Alert status="error" height="12px" fontSize="12px" borderRadius="3px" mb={2}>
                                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                                Input value does not match the required format
                                            </Alert>
                                        )}
                                    </>
                                )}
                                <FormControl>
                                    <FormLabel className="required">Tenant Id</FormLabel>
                                    <Input
                                        mb={4}
                                        variant="outline"
                                        id="tenantId"
                                        borderColor={'black'}
                                        maxLength="36"
                                        value={DeploymentData.tenantId}
                                        onChange={e => handleData('tenantId', e.target.value)}
                                        onBlur={e => handleBlur('tenantId', e.target.value)}
                                    ></Input>
                                </FormControl>
                                {validateTenantIdField && (
                                    <>
                                        {DeploymentData.tenantId.length < 36 ? (
                                            <Alert status="error" height="12px" fontSize="12px" borderRadius="3px" mb={2}>
                                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                                Input value must be at least 36 characters
                                            </Alert>
                                        ) : (
                                            <Alert status="error" height="12px" fontSize="12px" borderRadius="3px" mb={2}>
                                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                                Input value does not match the required format
                                            </Alert>
                                        )}
                                    </>
                                )}
                                <FormControl>
                                    <FormLabel className="required">Location</FormLabel>
                                    <Select
                                        mb={4}
                                        variant="outline"
                                        id="location"
                                        borderColor={'black'}
                                        backgroundColor={'  #F2F2F2'}
                                        disabled="true"
                                        value={DeploymentData.location}
                                        onChange={e => handleData('location', e.target.value)}
                                    >
                                        <option value="canadacentral">Canada Central</option>
                                    </Select>
                                </FormControl>
                            </div>
                        )}
                        {selectedImage === 'aws' && (
                            <div>
                                <FormControl>
                                    <FormLabel className="required">AWS Account Id</FormLabel>
                                    <Input
                                        mb={4}
                                        variant="outline"
                                        type="text"
                                        placeholder="123456789"
                                        id="awsAccountId"
                                        onKeyPress={handleKeyPress}
                                        maxLength="12"
                                        borderColor={'black'}
                                        value={DeploymentData.awsAccountId}
                                        onChange={e => handleData('awsAccountId', e.target.value)}
                                    ></Input>
                                </FormControl>
                                {DeploymentData.awsAccountId && DeploymentData.awsAccountId.length !== 12 && (
                                    <Alert status="error" height="12px" fontSize="12px" borderRadius="3px" mb={2}>
                                        <AlertIcon style={{ width: '14px', height: '14px' }} />
                                        Input value must be at least 12 digits
                                    </Alert>
                                )}
                                <FormControl>
                                    <FormLabel className="required">AWS Region</FormLabel>
                                    <Select
                                        mb={4}
                                        variant="outline"
                                        id="awsRegion"
                                        borderColor={'black'}
                                        value={DeploymentData.awsRegion || ''}
                                        onChange={e => handleData('awsRegion', e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Select an option
                                        </option>
                                        <option value="us-east-2">US East (Ohio)</option>
                                        <option value="us-east-1">US East (N. Virginia)</option>
                                        <option value="ap-south-1">Asia Pacific (Mumbai)</option>
                                    </Select>
                                </FormControl>
                            </div>
                        )}
                        {selectedImage && selectedImage !== 'minikube' && selectedImage !== 'none' ? (
                            <FormControl>
                                <FormLabel className="required">Deployment Type</FormLabel>
                                <Select
                                    mb={4}
                                    variant="outline"
                                    id="deploymentType"
                                    borderColor={'black'}
                                    value={DeploymentData.deploymentType}
                                    onChange={e => handleData('deploymentType', e.target.value)}
                                    backgroundColor={'  #F2F2F2'}
                                    disabled="true"
                                >
                                    <option value="" disabled>
                                        Select an option
                                    </option>
                                    <option value="kubernetes">Kubernetes</option>
                                </Select>
                            </FormControl>
                        ) : (
                            <></>
                        )}

                        {DeploymentData.deploymentType === 'kubernetes' && selectedImage !== 'none' && selectedImage !== 'minikube' && (
                            <div>
                                <FormControl>
                                    <FormLabel className="required">Cluster Name</FormLabel>
                                    <Input
                                        mb={4}
                                        variant="outline"
                                        id="clusterName"
                                        borderColor={'black'}
                                        maxLength="63"
                                        value={DeploymentData.clusterName}
                                        onChange={e => handleData('clusterName', e.target.value)}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel className="required">Namespace</FormLabel>
                                    <Input
                                        mb={4}
                                        variant="outline"
                                        id="kubernetesnamespace"
                                        maxLength="63"
                                        placeholder="Kubernetes Namespace"
                                        borderColor={'black'}
                                        value={DeploymentData.kubernetesNamespace}
                                        onChange={e => handleData('kubernetesNamespace', e.target.value)}
                                    />
                                </FormControl>
                                {DeploymentData.clusterName && !clusterNameCheck ? (
                                    <Alert status="error" height="38px" fontSize="12px" borderRadius="3px" mb={2}>
                                        <AlertIcon style={{ width: '14px', height: '14px' }} />
                                        Cluster Name should not contain special characters or start with number.
                                    </Alert>
                                ) : (
                                    <></>
                                )}
                                {azureClusterNameCheck && (
                                    <Alert status="error" height="12px" fontSize="12px" borderRadius="3px" mb={2}>
                                        <AlertIcon style={{ width: '14px', height: '14px' }} />
                                        The input cannot contain this reserved word
                                    </Alert>
                                )}
                                <FormControl>
                                    <FormLabel className="required">Enable Dynamic Storage</FormLabel>
                                    <Select
                                        mb={4}
                                        variant="outline"
                                        id="kubernetesUseDynamicStorage"
                                        borderColor={'black'}
                                        value={DeploymentData.kubernetesUseDynamicStorage}
                                        onChange={e => handleData('kubernetesUseDynamicStorage', e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Select an option
                                        </option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </Select>
                                </FormControl>
                                {DeploymentData.kubernetesUseDynamicStorage === 'true' && selectedImage !== 'azure' && (
                                    <FormControl>
                                        <FormLabel className="required">Storage Class Name</FormLabel>
                                        <Input
                                            mb={4}
                                            variant="outline"
                                            id="kubernetesStorageClassName"
                                            placeholder="Kubernetes Storage Class Name"
                                            borderColor={'black'}
                                            maxLength="63"
                                            value={DeploymentData.kubernetesStorageClassName}
                                            onChange={e => handleData('kubernetesStorageClassName', e.target.value)}
                                        />
                                        {DeploymentData.kubernetesStorageClassName && !storageClassCheck ? (
                                            <Alert status="error" height="38px" fontSize="12px" borderRadius="3px" mb={2}>
                                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                                Storage Class Name should not contain special characters, numbers or uppercase.
                                            </Alert>
                                        ) : (
                                            <></>
                                        )}
                                    </FormControl>
                                )}

                                {DeploymentData.kubernetesNamespace && !namespaceCheck ? (
                                    <Alert status="error" height="38px" fontSize="12px" borderRadius="3px" mb={2}>
                                        <AlertIcon style={{ width: '14px', height: '14px' }} />
                                        Namespace should not contain special characters or start with number.
                                    </Alert>
                                ) : (
                                    <></>
                                )}
                                <FormControl>
                                    <FormLabel className="required">Ingress Type</FormLabel>
                                    <Select
                                        mb={4}
                                        variant="outline"
                                        id="ingressType"
                                        borderColor={'black'}
                                        value={DeploymentData.ingressType}
                                        backgroundColor={'#F2F2F2'}
                                        disabled="true"
                                        onChange={e => handleData('ingress', e.target.value)}
                                    >
                                        <option value="istio">Istio</option>
                                    </Select>
                                </FormControl>
                                {DeploymentData.ingressType === 'istio' && (
                                    <FormControl>
                                        <FormLabel>Ingress Domain Name</FormLabel>
                                        <Input
                                            mb={4}
                                            variant="outline"
                                            id="ingressDomain"
                                            placeholder="Ingress Domain Name"
                                            borderColor={'black'}
                                            maxLength="63"
                                            value={DeploymentData.ingressDomain}
                                            onChange={e => handleData('ingressDomain', e.target.value)}
                                        />
                                        {DeploymentData.ingressDomain && !domainNameCheck ? (
                                            <Alert status="error" height="12px" fontSize="12px" borderRadius="3px" mb={2}>
                                                <AlertIcon style={{ width: '14px', height: '14px' }} />
                                                Domain name validation is not satisfied.
                                            </Alert>
                                        ) : (
                                            <></>
                                        )}
                                    </FormControl>
                                )}
                                <FormControl>
                                    <FormLabel className="required">Enable Service Monitoring</FormLabel>
                                    <Select
                                        mb={4}
                                        variant="outline"
                                        id="monitoring"
                                        borderColor={'black'}
                                        value={DeploymentData.monitoring}
                                        onChange={e => handleData('monitoring', e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Select an option
                                        </option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel className="required">Enable Kubernetes Dashboard</FormLabel>
                                    <Select
                                        mb={4}
                                        variant="outline"
                                        id="k8sWebUI"
                                        borderColor={'black'}
                                        value={DeploymentData.k8sWebUI}
                                        onChange={e => handleData('k8sWebUI', e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Select an option
                                        </option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </Select>
                                </FormControl>
                            </div>
                        )}
                        {selectedImage === 'minikube' && (
                            <>
                                <FormControl>
                                    <FormLabel className="required">Namespace</FormLabel>
                                    <Input
                                        mb={4}
                                        variant="outline"
                                        id="kubernetesnamespace"
                                        maxLength="63"
                                        placeholder="Kubernetes Namespace"
                                        borderColor={'black'}
                                        value={DeploymentData.kubernetesNamespace}
                                        onChange={e => handleData('kubernetesNamespace', e.target.value)}
                                    />
                                </FormControl>
                                {DeploymentData.kubernetesNamespace && !namespaceCheck ? (
                                    <Alert status="error" height="12px" fontSize="12px" borderRadius="3px" mb={2}>
                                        <AlertIcon style={{ width: '14px', height: '14px' }} />
                                        Namespace should not contain special characters.
                                    </Alert>
                                ) : (
                                    <></>
                                )}
                                <FormControl>
                                    <FormLabel className="required">Repository Name</FormLabel>
                                    <Input
                                        mb={4}
                                        variant="outline"
                                        id="dockerRepositoryName"
                                        placeholder="Docker Repository Name"
                                        borderColor={'black'}
                                        maxLength="32"
                                        value={DeploymentData.dockerRepositoryName}
                                        onChange={e => handleData('dockerRepositoryName', e.target.value)}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel className="required">Ingress Type</FormLabel>
                                    <Select
                                        mb={4}
                                        variant="outline"
                                        id="ingressType"
                                        borderColor={'black'}
                                        value={DeploymentData.ingressType}
                                        onChange={e => handleData('ingress', e.target.value)}
                                        backgroundColor={'#F2F2F2'}
                                        disabled="true"
                                    >
                                        <option value="istio">Istio</option>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel className="required">Enable Dynamic Storage</FormLabel>
                                    <Select
                                        mb={4}
                                        variant="outline"
                                        id="kubernetesUseDynamicStorage"
                                        borderColor={'black'}
                                        value={DeploymentData.kubernetesUseDynamicStorage}
                                        onChange={e => handleData('kubernetesUseDynamicStorage', e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Select an option
                                        </option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel className="required">Enable Monitoring</FormLabel>
                                    <Select
                                        mb={4}
                                        variant="outline"
                                        id="monitoring"
                                        borderColor={'black'}
                                        value={DeploymentData.monitoring}
                                        onChange={e => handleData('monitoring', e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Select an option
                                        </option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </Box>
                )}
            </Box>
            <Button
                mx={4}
                my={2}
                colorScheme="blue"
                onClick={() => {
                    selectedImage !== 'none' ? handleSubmit(DeploymentData) : onSubmit(projectData, true);
                }}
                minH={'48px'}
                isDisabled={selectedImage !== 'none' && (!selectedImage || isCheckEmpty() || checkValidation())}
            >
                Generate Code
            </Button>
        </Flex>
    );
};

export default Infrastructure;
