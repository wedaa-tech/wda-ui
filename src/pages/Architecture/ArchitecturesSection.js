import React, { useState, useRef, useEffect } from 'react';
import { Box, Text, Heading, SimpleGrid, Flex, useDisclosure, Skeleton, useToast, Tooltip } from '@chakra-ui/react';
import ArchitectureCard from './ArchitectureCard';
import './ArchitecturesSection.css';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useHistory } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import ActionModal from '../../components/Modal/ActionModal';
import { dummyarchs } from './Constants';

function ArchitecturesSection() {
    let location = useLocation();
    const history = useHistory();

    // var { parentId } = useParams();
    const [parentId, setParentId] = useState(undefined);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { initialized, keycloak } = useKeycloak();
    const [isLoaded, setIsLoaded] = useState(false);
    const cancelRef = React.useRef();

    // if (parentId === undefined) {
    //     history.push('/projects');
    // }

    // const [projectName, setProjectName] = useState(location?.state?.state?.projectName);

    const [isNewArchitectureModalOpen, setNewArchitectureModalOpen] = useState(false);
    const [newArchitectureName, setNewArchitectureName] = useState('');
    const initialRef = useRef(null);
    const [architectures, setArchitectures] = useState(dummyarchs);
    const [totalArchitectures, setTotalArchitectures] = useState(0);
    const [architectureId, setArchitectureId] = useState(null);
    const [architectureTitle, setArchitectureTitle] = useState(null);
    var blueprintIds = [];
    var completedBlueprints = [];

    const handleOpenNewArchitectureModal = () => {
        setNewArchitectureModalOpen(true);
    };

    const handleCloseNewArchitectureModal = () => {
        setNewArchitectureModalOpen(false);
        setNewArchitectureName('');
    };

    const handleInputKeyPress = event => {
        if (event.key === 'Enter') {
            handleCreateNewArchitecture();
        }
    };

    const handleCreateNewArchitecture = () => {
        history.push('/project/' + parentId + '/architecture/create', {
            replace: true,
            parentId: parentId,
        });
        handleCloseNewArchitectureModal();
    };

    useEffect(() => {
        if (keycloak?.realmAccess?.roles.includes('ADMIN') && location.pathname === '/architectures') {
            setParentId('admin');
        }
        if (initialized) {
            if (keycloak?.realmAccess?.roles.includes('ADMIN') && location.pathname === '/architectures') {
                fetch(process.env.REACT_APP_API_BASE_URL + '/refArchs/', {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                    },
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result?.data) {
                            const archslist = structuredClone(result.data);
                            setArchitectures(archslist);
                            setTotalArchitectures(archslist.length);
                            blueprintIds = archslist
                                .map(entry =>
                                    entry.project_id && entry.latestCodeGenerationStatus === 'IN-PROGRESS' ? entry.project_id : null,
                                )
                                .filter(id => id !== null);
                            pollCodeGenerationStatus(blueprintIds,archslist);
                            setIsLoaded(true);
                        }
                    })
                    .catch(error => console.error(error));
            } else {
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
                                            setParentId(defaultProjectId);
                                            setIsLoaded(true);
                                        }
                                    })
                                    .catch(error => console.error(error));
                            } else {
                                setParentId(defaultProjectId);
                                fetch(process.env.REACT_APP_API_BASE_URL + '/api/projects/architectures/' + defaultProjectId, {
                                    method: 'get',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                                    },
                                })
                                    .then(response => response.json())
                                    .then(result => {
                                        if (result?.data) {
                                            const archslist = structuredClone(result.data);
                                            setArchitectures(archslist);
                                            setTotalArchitectures(archslist.length);
                                            blueprintIds = archslist
                                                .map(entry =>
                                                    entry.project_id && entry.latestCodeGenerationStatus === 'IN-PROGRESS'
                                                        ? entry.project_id
                                                        : null,
                                                )
                                                .filter(id => id !== null);
                                            pollCodeGenerationStatus(blueprintIds,archslist);
                                            setIsLoaded(true);
                                        }
                                    })
                                    .catch(error => console.error(error));
                            }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }
    }, [initialized, keycloak?.realmAccess?.roles, keycloak?.token, location.pathname]);

    const pollCodeGenerationStatus = async (blueprintIds,archslist) => {
        const statusUrl = process.env.REACT_APP_API_BASE_URL + '/api/code-generation-status';
        while (blueprintIds.length !== 0) {
            try {
                const response = await fetch(statusUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                    },
                    body: JSON.stringify({ blueprintIds }),
                });

                const statuses = await response.json();

                blueprintIds = blueprintIds.filter(blueprintId => {
                    const status = statuses.find(status => status.blueprintId === blueprintId);
                    if (status) {
                        if (status.status === 'COMPLETED') {
                            toast.close(toastIdRef.current);
                            const projectName = archslist.find(project => project.project_id === blueprintId)?.projectName || blueprintId;
                            toastIdRef.current = toast({
                                title: `${projectName} is available to download`,
                                status: 'success',
                                duration: 3000,
                                variant: 'left-accent',
                                isClosable: true,
                            });
                            completedBlueprints.push(blueprintId);
                            const updatedArchitectures = archslist.map(architecture => {
                                if (architecture.project_id === blueprintId) {
                                  return { ...architecture, latestCodeGenerationStatus: "COMPLETED" };
                                } else {
                                  return architecture;
                                }
                              });
                              setArchitectures(updatedArchitectures);
                            return false;
                        } else if (status.status === 'IN-PROGRESS') {
                            return true;
                        }
                    }
                    return false;
                });

                if (blueprintIds.length !== 0) {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            } catch (error) {
                console.error('Error while polling code generation status:', error);
            }
        }
    };

    const handleOpenArchitecture = (project_id, data) => {
        if (data.validationStatus === 'VALIDATED')
            history.push('/project/' + parentId + '/architecture/' + project_id + '/details', {
                replace: true,
                state: data,
            });
        else
            history.push('/project/' + parentId + '/architecture/' + project_id + '/edit', {
                replace: true,
                state: data,
            });
    };

    const toast = useToast({
        containerStyle: {
            width: '500px',
            maxWidth: '100%',
        },
    });
    const toastIdRef = useRef();


    const createArchitecture = async data => {
        var updatedData = data;
        updatedData.services = {};
        updatedData.communications = {};

        const nodes = data.metadata?.nodes;
        const edges = data.metadata?.edges;

        let currentIndex = 0;

        if (nodes && Object.keys(nodes).length > 0) {
            for (const [key, value] of Object.entries(nodes)) {
                if (key.startsWith('UI') || key.startsWith('Service') || key.startsWith('Gateway')) {
                    updatedData.services[currentIndex++] = value.data;
                }
            }
        }

        currentIndex = 0;

        if (edges && Object.keys(edges).length > 0) {
            for (const [_, value] of Object.entries(edges)) {
                updatedData.communications[currentIndex++] = value.data;
            }
        }

        const endpoint = data?.request_json?.parentId === 'admin' ? '/api/refArchs' : '/api/blueprints';

        try {
            const response = await fetch(process.env.REACT_APP_API_BASE_URL + endpoint, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                const res = await response.json();
                if (data?.request_json?.parentId === 'admin') {
                    data._id = res._id;
                    data.id = res.projectId;
                    data.projectId = res.projectId;
                    data.name = data.projectName;
                } else {
                    data.project_id = res.projectId;
                    data._id = res._id;
                }
                setArchitectures([data, ...architectures]);
                setTotalArchitectures(architectures.length + 1);
                toastIdRef.current = toast({
                    title: `${parentId === 'admin' ? 'Reference Architecture' : 'Prototype'} ${data.projectName} created`,
                    status: 'success',
                    duration: 3000,
                    variant: 'left-accent',
                    isClosable: true,
                });
            } else {
                console.error('Failed to Clone architecture');
            }
        } catch (error) {
            console.error('Error cloning architecture:', error);
        }
    };

    const deleteArchitecture = data => {
        if (initialized) {
            if (parentId === 'admin' && location.pathname === '/architectures') {
                fetch(process.env.REACT_APP_API_BASE_URL + '/api/refArchs/' + data.id, {
                    method: 'delete',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                    },
                })
                    .then(response => response.json())
                    .then(res => {
                        const updatedArchitectures = architectures.filter(card => card.id !== data.id);
                        setArchitectures(updatedArchitectures);
                        setTotalArchitectures(updatedArchitectures.length);
                    })
                    .catch(error => console.error('Error deleting ref.arch:', error));
            } else {
                fetch(process.env.REACT_APP_API_BASE_URL + '/api/blueprints/' + data.id, {
                    method: 'delete',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                    },
                })
                    .then(response => response.json())
                    .then(res => {
                        const updatedArchitectures = architectures.filter(card => card.project_id !== data.id);
                        setArchitectures(updatedArchitectures);
                        setTotalArchitectures(updatedArchitectures.length);
                    })
                    .catch(error => console.error('Error deleting card:', error));
            }
        }
        onClose(true);
    };

    return (
        <Box p="4" maxWidth="7xl" mx="auto">
            {/* {!(parentId === 'admin') && (
                <IconButton
                    variant="outline"
                    colorScheme="black"
                    aria-label="Delete Projects"
                    icon={<ArrowBackIcon />}
                    onClick={() => history.push('/projects')}
                />
            )} */}
            <Flex justifyContent={'space-between'} alignItems={'center'}>
                <Heading className="not-selectable" as="h1" my="6">
                    {/* {parentId === 'admin' ? 'Reference Architectures' : 'Prototypes'} */}
                </Heading>
                {/* {!(parentId === 'admin') && (
                    <Text justifyItems={'flex-end'} display={'grid'} fontWeight="bold">
                        Project Name
                        <Text fontWeight="bold" fontFamily={'monospace'} fontSize={'30px'} color={'#ebaf24'}>
                            {projectName}
                        </Text>
                    </Text>
                )} */}
            </Flex>

            <SimpleGrid className="simple-grid" minChildWidth="null" columns={{ base: 1, sm: 1, md: 3 }} spacing={10}>
                <Skeleton isLoaded={isLoaded} fadeDuration={1}>
                    <Box
                        maxWidth={96}
                        minWidth={96}
                        cursor="pointer"
                        className="create-architecture"
                        p="4"
                        borderWidth="1px"
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        px="10%"
                        height={'100px'}
                        onClick={handleCreateNewArchitecture}
                    >
                        <Text className="not-selectable" fontWeight="bold">
                            Create New {parentId === 'admin' ? 'Architectures' : 'Prototype'}
                        </Text>
                        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                            <rect width="56" height="56" rx="28" fill="#EBAF24" fill-opacity="0.5" />
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M30.6667 14.6667C30.6667 13.1939 29.4728 12 28 12C26.5273 12 25.3334 13.1939 25.3334 14.6667V25.3332H14.6667C13.1939 25.3332 12 26.5271 12 27.9999C12 29.4726 13.1939 30.6665 14.6667 30.6665H25.3334V41.3333C25.3334 42.8061 26.5273 44 28 44C29.4728 44 30.6667 42.8061 30.6667 41.3333V30.6665H41.3333C42.8061 30.6665 44 29.4726 44 27.9999C44 26.5271 42.8061 25.3332 41.3333 25.3332H30.6667V14.6667Z"
                                fill="white"
                            />
                        </svg>
                    </Box>
                </Skeleton>
                <Skeleton isLoaded={isLoaded} fadeDuration={1}>
                    <Box
                        maxWidth={96}
                        minWidth={96}
                        className="total-architecture"
                        p="4"
                        borderWidth="1px"
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        px="10%"
                        height={'100px'}
                    >
                        <Text className="not-selectable" fontWeight="bold">
                            Number of {parentId === 'admin' ? 'Architectures' : 'Prototypes'}
                        </Text>
                        <Text className="not-selectable" fontWeight="bold" fontFamily={'monospace'} fontSize={'30px'} color={'#ebaf24'}>
                            {totalArchitectures}
                        </Text>
                    </Box>
                </Skeleton>
                <Box maxWidth={96} minWidth={96}></Box>
            </SimpleGrid>
            <Heading className="not-selectable" as="h3" size="lg" my="10">
                {parentId === 'admin' ? 'Reference Architectures' : 'Prototypes'}
            </Heading>
            <SimpleGrid className="simple-grid" minChildWidth="null" columns={{ base: 1, sm: 2, md: 3 }} spacing={10}>
                {architectures.map((architecture, index) => (
                    <ArchitectureCard
                        key={index}
                        projectId={architecture?.name ? architecture.id : architecture.project_id}
                        title={architecture?.name ? architecture?.name : architecture.projectName}
                        data={architecture}
                        parentId={parentId}
                        description={architecture.description}
                        imageUrl={architecture.imageUrl}
                        published={architecture.published}
                        handleSubmit={createArchitecture}
                        onClick={handleOpenArchitecture}
                        onDelete={(title, projectId) => {
                            setArchitectureId(projectId);
                            setArchitectureTitle(title);
                            onOpen(true);
                        }}
                        isLoaded={isLoaded}
                    />
                ))}
            </SimpleGrid>
            {/* <Modal
                initialFocusRef={initialRef}
                isOpen={isNewArchitectureModalOpen}
                onClose={handleCloseNewArchitectureModal}
                isCentered
                size={'xl'}
                motionPreset="slideInBottom"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create New Prototype</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <SimpleGrid columns={2} spacing="10" padding={'10px'}>
                            <Box onClick={handleCreateNewArchitecture} as="button" bgImage={application} className="image-select">
                                <Text className="not-selectable image-text">Application</Text>
                            </Box>
                            <Tooltip hasArrow color={'black'} label="Not yet Supported" bg="gray.300">
                                <Box onClick={''} bgImage={cipipeline} className="image-select" disabled>
                                    <Text className="not-selectable image-text">CI Pipeline</Text>
                                </Box>
                            </Tooltip>
                            <Tooltip hasArrow label="Not yet Supported" color={'black'} bg="gray.300">
                                <Box onClick={''} bgImage={cdpipeline} className="image-select" disabled>
                                    <Text className="not-selectable image-text">CD Pipeline</Text>
                                </Box>
                            </Tooltip>
                            <Tooltip hasArrow label="Not yet Supported" color={'black'} bg="gray.300">
                                <Box onClick={''} bgImage={mlpipeline} className="image-select" disabled>
                                    <Text className="not-selectable image-text">ML Pipeline</Text>
                                </Box>
                            </Tooltip>
                        </SimpleGrid>
                    </ModalBody>
                    <ModalFooter></ModalFooter>
                </ModalContent>
            </Modal> */}
            <ActionModal
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={id => deleteArchitecture(id)}
                actionType={'deleteArch'}
                name={architectureTitle}
                id={architectureId}
            />
        </Box>
    );
}

ArchitecturesSection.defaultProps = {
    projectName: 'testing1',
};

export default ArchitecturesSection;
