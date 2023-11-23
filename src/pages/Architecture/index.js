import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Text,
    Heading,
    SimpleGrid,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Flex,
    Tooltip,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    useDisclosure,
    IconButton,
} from '@chakra-ui/react';
import ArchitectureCard from './ArchitectureCard';
import mlpipeline from '../../assets/archModel/ml.png';
import cipipeline from '../../assets/archModel/ci.jpeg';
import cdpipeline from '../../assets/archModel/cd.png';
import application from '../../assets/archModel/application.png';
import './index.css';
import { useLocation, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useHistory } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import ActionModal from '../../components/Modal/ActionModal';
import { ArrowBackIcon } from '@chakra-ui/icons';

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

function ArchitecturesSection() {
    let location = useLocation();
    const history = useHistory();

    var { parentId } = useParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { initialized, keycloak } = useKeycloak();
    const cancelRef = React.useRef();

    if (keycloak?.realmAccess?.roles.includes('ADMIN') && location.pathname === '/architectures') {
        parentId = 'admin';
    }

    if (parentId === undefined) {
        history.push('/projects');
    }

    const [projectName, setProjectName] = useState(location?.state?.state?.projectName);

    const [isNewArchitectureModalOpen, setNewArchitectureModalOpen] = useState(false);
    const [newArchitectureName, setNewArchitectureName] = useState('');
    const initialRef = useRef(null);
    const [architectures, setArchitectures] = useState([]);
    const [totalArchitectures, setTotalArchitectures] = useState(0);
    const [architectureId, setArchitectureId] = useState(null);
    const [architectureTitle, setArchitectureTitle] = useState(null);

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
                        }
                    })
                    .catch(error => console.error(error));
            } else {
                fetch(process.env.REACT_APP_API_BASE_URL + '/api/projects/architectures/' + parentId, {
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
                        }
                    })
                    .catch(error => console.error(error));
            }
        }
    }, [initialized, keycloak, parentId]);

    const handleOpenArchitecture = (project_id, data) => {
        if (data.draft || data?.request_json?.services)
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
            {!(parentId === 'admin') && (
                <IconButton
                    variant="outline"
                    colorScheme="black"
                    aria-label="Delete Projects"
                    icon={<ArrowBackIcon />}
                    onClick={() => history.push('/projects')}
                />
            )}
            <Flex justifyContent={'space-between'} alignItems={'center'}>
                <Heading className="not-selectable" as="h1" my="10">
                    {parentId === 'admin' ? 'Reference Architectures' : 'Architectures'}
                </Heading>
                {!(parentId === 'admin') && (
                    <Text justifyItems={'flex-end'} display={'grid'} fontWeight="bold">
                        Project Name
                        <Text fontWeight="bold" fontFamily={'monospace'} fontSize={'30px'} color={'#ebaf24'}>
                            {projectName}
                        </Text>
                    </Text>
                )}
            </Flex>

            <SimpleGrid className="simple-grid" minChildWidth="null" columns={{ base: 1, sm: 1, md: 3 }} spacing={10}>
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
                    onClick={handleOpenNewArchitectureModal}
                >
                    <Text className="not-selectable" fontWeight="bold">
                        Create New Architecture
                    </Text>
                    <span className="not-selectable" inputMode="none" style={thickPlusIconStyle}>
                        +
                    </span>
                </Box>
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
                        Number of Architectures
                    </Text>
                    <Text className="not-selectable" fontWeight="bold" fontFamily={'monospace'} fontSize={'30px'} color={'#ebaf24'}>
                        {totalArchitectures}
                    </Text>
                </Box>
                <Box maxWidth={96} minWidth={96}></Box>
            </SimpleGrid>
            <Heading className="not-selectable" as="h3" size="lg" my="10">
                {parentId === 'admin' ? 'Your Reference Architectures' : 'Your Architectures'}
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
                        onClick={handleOpenArchitecture}
                        onDelete={(title, projectId) => {
                            setArchitectureId(projectId);
                            setArchitectureTitle(title);
                            onOpen(true);
                        }}
                    />
                ))}
            </SimpleGrid>
            <Modal
                initialFocusRef={initialRef}
                isOpen={isNewArchitectureModalOpen}
                onClose={handleCloseNewArchitectureModal}
                isCentered
                size={'xl'}
                motionPreset="slideInBottom"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create New Architecture</ModalHeader>
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
            </Modal>
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
