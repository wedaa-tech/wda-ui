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
    Flex,
} from '@chakra-ui/react';
import ArchitectureCard from './ArchitectureCard';
import design1 from '../../assets/markets/design1.png';
import design2 from '../../assets/markets/design2.png';
import mlpipeline from '../../assets/archModel/ml.png';
import cipipeline from '../../assets/archModel/ci.jpeg';
import cdpipeline from '../../assets/archModel/cd.png';
import application from '../../assets/archModel/application.png';
import './index.css';
import { useLocation, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useHistory } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

const architectures = [
    {
        title: 'Architecture 1',
        description: 'Description for Architecture 1',
        imageUrl: design1, // Replace with actual image URL
    },
    {
        title: 'Architecture 2',
        description: 'Description for Architecture 2',
        imageUrl: design2, // Replace with actual image URL
    },
    {
        title: 'Architecture 3',
        description: 'Description for Architecture 3',
        imageUrl: design1, // Replace with actual image URL
    },
    {
        title: 'Architecture 4',
        description: 'Description for Architecture 4',
        imageUrl: design2, // Replace with actual image URL
    },
    {
        title: 'Architecture 2',
        description: 'Description for Architecture 2',
        imageUrl: design2, // Replace with actual image URL
    },
    {
        title: 'Architecture 3',
        description: 'Description for Architecture 3',
        imageUrl: design1, // Replace with actual image URL
    },
    {
        title: 'Architecture 4',
        description: 'Description for Architecture 4',
        imageUrl: design2, // Replace with actual image URL
    },
    // Add more architectures here
];

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
    backgroundColor: '#7dadd882',
    color: 'white',
};

function ArchitecturesSection() {
    let location = useLocation();
    const history = useHistory();

    const { parentId } = useParams();

    console.log(location.state, location);

    // if (location.state === undefined || !parentId) {
    //   history.push("/projects", {
    //     replace: true,
    //   });
    // }

    const [projectName, setProjectName] = useState(location?.state?.state?.projectName);

    // console.log(projectName, location.state, location.state.projectName, location, );
    const [isNewArchitectureModalOpen, setNewArchitectureModalOpen] = useState(false);
    const [newArchitectureName, setNewArchitectureName] = useState('');
    const initialRef = useRef(null);

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
        console.log(parentId);
        history.push('/canvastocode', {
            replace: true,
            state: { parentId: parentId },
        });
        handleCloseNewArchitectureModal();
    };

    const { initialized, keycloak } = useKeycloak();
    const [architectures, setArchitectures] = useState([]);
    const [totalArchitectures, setTotalArchitectures] = useState(0);

    useEffect(() => {
        if (initialized) {
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

                        if (archslist.length === 0) {
                            setNewArchitectureModalOpen(true);
                        } else {
                            setProjectName(archslist[0].projectName);
                            setArchitectures(archslist);
                            setTotalArchitectures(archslist.length);
                        }
                    }
                })
                .catch(error => console.error(error));
        }
    }, [initialized, keycloak, parentId]);

    const handleOpenArchitecture = (project_id, data) => {
        console.log(project_id, data, 'project_id, data');
        history.push('/project/' + parentId + '/architecture/' + project_id + '/details', {
            replace: true,
            state: data,
        });
    };

    return (
        <Box p="4" maxWidth="1200px" mx="auto">
            <Flex justifyContent={'space-between'} alignItems={'center'}>
                <Heading className="not-selectable" as="h1" my="10">
                    Architectures
                </Heading>
                <Text justifyItems={'flex-end'} display={'grid'} className="not-selectable" fontWeight="bold">
                    Project Name
                    <Text className="not-selectable" fontWeight="bold" fontFamily={'monospace'} fontSize={'30px'} color={'#3182ce'}>
                        {projectName}
                    </Text>
                </Text>
            </Flex>

            <SimpleGrid columns={[2, null, 3]} spacing="40px">
                <Box
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
                    <Text className="not-selectable" fontWeight="bold" fontFamily={'monospace'} fontSize={'30px'} color={'#3182ce'}>
                        {totalArchitectures}
                    </Text>
                </Box>
                <Box
                    className="total-architecture"
                    borderWidth="1px"
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    px="10%"
                    height={'100px'}
                >
                    <Text className="not-selectable" fontWeight="bold">
                        Number of Drafts
                    </Text>
                    <Text className="not-selectable" fontWeight="bold" fontFamily={'monospace'} fontSize={'30px'} color={'#3182ce'}>
                        {totalArchitectures}
                    </Text>
                </Box>
            </SimpleGrid>
            <Heading className="not-selectable" as="h3" size="lg" my="10">
                Your Architectures
            </Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing="10">
                {architectures.map((architecture, index) => (
                    <ArchitectureCard
                        key={index}
                        projectId={architecture.project_id}
                        title={architecture.projectName}
                        data={architecture}
                        description={architecture.description}
                        imageUrl={architecture.imageUrl}
                        onClick={handleOpenArchitecture}
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
                            <Box onClick={handleCreateNewArchitecture} bgImage={cipipeline} className="image-select" disabled>
                                <Text className="not-selectable image-text">CI Pipeline</Text>
                            </Box>
                            <Box onClick={handleCreateNewArchitecture} bgImage={cdpipeline} className="image-select" disabled>
                                <Text className="not-selectable image-text">CD Pipeline</Text>
                            </Box>
                            <Box onClick={handleCreateNewArchitecture} bgImage={mlpipeline} className="image-select" disabled>
                                <Text className="not-selectable image-text">ML Pipeline</Text>
                            </Box>
                        </SimpleGrid>
                    </ModalBody>
                    <ModalFooter></ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

ArchitecturesSection.defaultProps = {
    projectName: 'testing1',
};

export default ArchitecturesSection;
