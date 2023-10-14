import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Text,
    Heading,
    SimpleGrid,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    ProgressLabel,
    Flex,
    Textarea,
    useToast,
} from '@chakra-ui/react';
import ProjectCard from './ProjectCard';
import './index.css';
import { useHistory } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

const thickPlusIconStyle = {
    display: 'grid',
    width: '50px',
    height: '50px',
    fontSize: '50px',
    fontWeight: 'bold',
    border: '3px',
    borderRadius: '50%',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#ebaf2482',
    color: 'white',
};

const ProjectsSection = () => {
    const history = useHistory();
    const [isNewProjectModalOpen, setNewProjectModalOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const initialRef = useRef(null);
    const maxCharacterLimit = 12;
    const maxDescCharacterLimit = 200;

    const handleOpenNewProjectModal = () => {
        setNewProjectModalOpen(true);
    };

    const handleCloseNewProjectModal = () => {
        setNewProjectModalOpen(false);
        setNewProjectName('');
    };

    const handleInputKeyPress = event => {
        if (event.key === 'Enter') {
            handleCreateNewProject();
        }
    };

    const handleCreateNewProject = async () => {
        if (projectsNames.includes(newProjectName)) return;
        var pid;
        if (initialized) {
            await fetch(process.env.REACT_APP_API_BASE_URL + '/api/projects', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
                body: JSON.stringify({
                    name: newProjectName,
                    description: newProjectDescription,
                }),
            })
                .then(response => response.json())
                .then(async result => {
                    if (result?.data) {
                        setNewProjectName(result.data.name);
                        pid = await result.data.id;
                    }
                })
                .catch(error => console.error(error));
        }
        history.push('/project/' + pid + '/architectures', {
            replace: true,
            state: { projectName: newProjectName },
        });
        handleCloseNewProjectModal();
    };

    const handleOpenProject = (projectName, parentId) => {
        history.push('/project/' + parentId + '/architectures', {
            replace: true,
            state: { projectName: projectName },
        });
    };

    const { initialized, keycloak } = useKeycloak();
    const [projects, setProjects] = useState([]);
    const [projectsNames, setProjectsNames] = useState([]);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastDescOpen, setToastDescOpen] = useState(false);

    const toast = useToast({
        containerStyle: {
            width: '500px',
            maxWidth: '100%',
        },
    });

    const handleChange = e => {
        const inputValue = e.target.value;

        if (inputValue.length <= maxCharacterLimit) {
            setNewProjectName(inputValue);
        } else {
            if (toastOpen) return;
            toast({
                title: 'Max characters allowed: 12',
                status: 'error',
                duration: 3000,
                variant: 'left-accent',
                isClosable: true,
            });
            setToastOpen(true);
        }
    };

    const handleDescriptionChange = e => {
        const inputValue = e.target.value;

        if (inputValue.length <= maxDescCharacterLimit) {
            setNewProjectDescription(inputValue);
        } else {
            if (toastDescOpen) return;
            toast({
                title: 'Max characters allowed: 200',
                status: 'error',
                duration: 3000,
                variant: 'left-accent',
                isClosable: true,
            });
            setToastDescOpen(true);
        }
    };

    useEffect(() => {
        if (initialized) {
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
                        const projectslist = structuredClone(result.data);
                        const projectsNameList = projectslist;
                        setProjectsNames(projectsNameList);
                        setProjects(projectslist);
                    }
                })
                .catch(error => console.error(error));
        }
    }, [initialized, keycloak]);
    const totalProjects = projects.length;

    return (
        <Box p="4" maxWidth="7xl" mx="auto">
            <Heading className="not-selectable" as="h1" my="10">
                Projects
            </Heading>
            <SimpleGrid className="simple-grid" minChildWidth="null" columns={{ base: 1, sm: 1, md: 3 }} spacing={10}>
                <Box
                    maxWidth={96}
                    minWidth={96}
                    cursor="pointer"
                    className="create-project"
                    p="4"
                    borderWidth="1px"
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    px="10%"
                    height={'100px'}
                    onClick={handleOpenNewProjectModal}
                >
                    <Text className="not-selectable" fontWeight="bold">
                        Create New Project
                    </Text>
                    <span className="not-selectable" inputMode="none" style={thickPlusIconStyle}>
                        +
                    </span>
                </Box>
                <Box
                    maxWidth={96}
                    minWidth={96}
                    className="total-project"
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
                        Number of Projects
                    </Text>
                    <Text className="not-selectable" fontWeight="bold" fontFamily={'monospace'} fontSize={'30px'} color={'#ebaf24'}>
                        {totalProjects}
                    </Text>
                </Box>
                <Box maxWidth={96} minWidth={96}></Box>
            </SimpleGrid>
            <Heading className="not-selectable" as="h3" size="lg" my="10">
                Your Projects
            </Heading>
            <SimpleGrid className="simple-grid" minChildWidth="null" columns={{ base: 1, sm: 2, md: 3 }} spacing={10}>
                {projects.map((project, index) => (
                    <ProjectCard
                        parentId={project.id}
                        title={project.name}
                        description={project?.description || 'No description available'}
                        count={project.blueprintCount}
                        imageUrl={
                            project?.imageUrl ||
                            'https://www.intellectsoft.net/blog/wp-content/uploads/Web-Application-Architecture-Diagram-1-1024x660.png'
                        }
                        onClick={handleOpenProject}
                    />
                ))}
            </SimpleGrid>
            <Modal
                initialFocusRef={initialRef}
                isOpen={isNewProjectModalOpen}
                onClose={handleCloseNewProjectModal}
                isCentered
                motionPreset="slideInBottom"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create New Project</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction={'column'}>
                            <Input
                                mb={2}
                                ref={initialRef}
                                placeholder="Enter project name"
                                value={newProjectName}
                                onChange={handleChange}
                            />
                            <Textarea
                                mb={2}
                                placeholder="Enter project description (optional)"
                                value={newProjectDescription}
                                onChange={handleDescriptionChange}
                            />
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleCreateNewProject}>Create</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default ProjectsSection;
