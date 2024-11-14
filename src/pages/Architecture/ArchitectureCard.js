import { CopyIcon, DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import { useState, useRef } from 'react';
import { saveAs } from 'file-saver';
import {
    Box,
    IconButton,
    Image,
    Skeleton,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    useToast,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Spinner,
    Tooltip,
} from '@chakra-ui/react';
import { useKeycloak } from '@react-keycloak/web';
import React from 'react';
import '../ProjectsSection/ProjectsSection.css';
import Constants from '../../Constants';

const GreenCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="green">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 18 21 6l-1.41-1.41L9 16.17z" />
    </svg>
);

const RedCloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="red">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
);

const ArchitectureCard = ({
    title,
    description,
    imageUrl,
    projectId,
    onClick,
    data,
    handleSubmit,
    onDelete,
    published,
    parentId,
    isLoaded = false,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPrototypeName, setNewPrototypeName] = useState('');
    const { initialized, keycloak } = useKeycloak();
    const toast = useToast({
        containerStyle: {
            width: '500px',
            maxWidth: '100%',
        },
    });
    const { codeGenerationStatus } = Constants;

    const toastIdRef = useRef();

    const handleCloneClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setNewPrototypeName('');
        setIsModalOpen(false);
    };

    const fetchProjectNames = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/project-names', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.ProjectNames;
        } catch (error) {
            console.error('Error fetching Project Names:', error);
        }
    };

    const handleCloneConfirm = async () => {
        var projectNames = await fetchProjectNames();
        setNewPrototypeName('');
        var updatedData;
        if (projectNames.includes(newPrototypeName)) {
            toast.close(toastIdRef.current);
            toastIdRef.current = toast({
                title: `Prototype with Name: ${newPrototypeName} already Exists.`,
                status: 'error',
                duration: 3000,
                variant: 'left-accent',
                isClosable: true,
            });
            return;
        }

        if (data?.request_json?.parentId === 'admin') {
            const { _id, id, name, projectName, request_json, ...rest } = data;
            const updatedRequestJson = {
                ...request_json,
                projectName: newPrototypeName,
            };
            delete updatedRequestJson.project_id;
            updatedData = {
                ...rest,
                request_json: updatedRequestJson,
                projectName: newPrototypeName,
                parentId: updatedRequestJson.parentId,
                published: false,
            };
        } else {
            const { project_id, _id, projectName, ...rest } = data;
            updatedData = { ...rest, projectName: newPrototypeName };
        }
        handleSubmit(updatedData);
        setIsModalOpen(false);
    };

    const handleDownload = async () => {
        if (data.latestCodeGenerationStatus == codeGenerationStatus.COMPLETED) {
            try {
                const response = await fetch(process.env.REACT_APP_API_BASE_URL + `/api/download/${data?.project_id}`, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                    },
                });
                const blob = await response.blob();
                saveAs(blob, `${data.projectName}.zip`);
            } catch (error) {
                console.error(error);
            }
        } else {
            toast.close(toastIdRef.current);
            toastIdRef.current = toast({
                title: `Prototype Updated: Please Generate again`,
                status: 'error',
                duration: 3000,
                variant: 'left-accent',
                isClosable: true,
            });
        }
    };

    return (
        <Skeleton isLoaded={isLoaded} fadeDuration={1}>
            <Box
                maxWidth={96}
                minWidth={96}
                maxW="sm"
                className={`project-card ${data.latestCodeGenerationStatus != codeGenerationStatus.IN_PROGRESS ? 'hover-card' : ''}`}
                height={'300px'}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                cursor="pointer"
                position="relative"
                p="6"
                zIndex="1"
                backgroundColor={data.latestCodeGenerationStatus == codeGenerationStatus.IN_PROGRESS ? '#f8f8f8' : '#fff'}
                onClick={() => {
                    data.latestCodeGenerationStatus != codeGenerationStatus.IN_PROGRESS && onClick(projectId, data);
                }}
            >
                <Image
                    style={{
                        width: '100%',
                        objectFit: 'contain',
                        mixBlendMode: 'darken',
                    }}
                    height="65%"
                    src={imageUrl}
                />
                {data.latestCodeGenerationStatus !== codeGenerationStatus.IN_PROGRESS && (
                    <>
                        {parentId != 'admin' && (
                            <Tooltip label="Download Prototype" placement="top" color="white" borderRadius="md" fontSize="sm">
                                <IconButton
                                    top="5%"
                                    size={'md'}
                                    right="33%"
                                    variant="outline"
                                    colorScheme="blackAlpha"
                                    className="prototype-icons"
                                    aria-label="Download Prototype"
                                    position="absolute"
                                    zIndex={99}
                                    icon={<DownloadIcon />}
                                    onClick={e => {
                                        // onDelete(title, projectId);
                                        handleDownload();
                                        e.stopPropagation();
                                    }}
                                />
                            </Tooltip>
                        )}
                        <Tooltip label="Delete Prototype" placement="top" color="white" borderRadius="md" fontSize="sm">
                            <IconButton
                                top="5%"
                                right="5%"
                                size="md"
                                minheight="10px"
                                minwidth="10px"
                                fontSize="14px"
                                variant="outline"
                                colorScheme="blackAlpha"
                                aria-label="Delete Architecture"
                                className="prototype-icons"
                                position="absolute"
                                zIndex={99}
                                icon={<DeleteIcon />}
                                onClick={e => {
                                    onDelete(title, projectId);
                                    e.stopPropagation();
                                }}
                            />
                        </Tooltip>
                        <Tooltip label="Clone Prototype" placement="top" color="white" borderRadius="md" fontSize="sm">
                            <IconButton
                                top="5%"
                                size={'md'}
                                right="19%"
                                variant="outline"
                                colorScheme="blackAlpha"
                                aria-label="Clone Prototype"
                                className="prototype-icons"
                                position="absolute"
                                zIndex={99}
                                icon={<CopyIcon />}
                                onClick={e => {
                                    handleCloneClick();
                                    e.stopPropagation();
                                }}
                            />
                        </Tooltip>
                    </>
                )}
                {parentId === 'admin' && (
                    <Box position="absolute" top="24%" right="9%" zIndex={99}>
                        {published ? <GreenCheckIcon /> : <RedCloseIcon />}
                    </Box>
                )}

                <Box p="6">
                    <Text
                        className="not-selectable"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                        }}
                        fontWeight="semibold"
                        fontSize="lg"
                        mb="2"
                    >
                        {title}
                    </Text>
                    {data.latestCodeGenerationStatus == codeGenerationStatus.FAILED && (
                        <Text className="not-selectable" color="red.500">
                            Generation Failed
                        </Text>
                    )}
                    {data.latestCodeGenerationStatus == codeGenerationStatus.IN_PROGRESS && (
                        <Text className="not-selectable" color="orange.400">
                            Generation in Progress <Spinner size="xs" />
                        </Text>
                    )}
                    {data.latestCodeGenerationStatus !== codeGenerationStatus.IN_PROGRESS && data.validationStatus === codeGenerationStatus.DRAFT && (
                        <Text className="not-selectable" color="yellow.500">
                            Draft
                        </Text>
                    )}
                    {data.latestCodeGenerationStatus !== codeGenerationStatus.IN_PROGRESS &&
                        data.latestCodeGenerationStatus !== codeGenerationStatus.FAILED &&
                        data.validationStatus === 'VALIDATED' && (
                            <Text className="not-selectable" color="green.600">
                                Validated
                            </Text>
                        )}
                    {/* <Text className="not-selectable" color="gray.600">
                        {description}
                    </Text> */}
                </Box>
            </Box>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="md" isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Clone {parentId == 'admin' ? 'Reference Architecture' : 'Prototype'}</ModalHeader>
                    <ModalBody>
                        <Input
                            placeholder={`Enter new ${parentId === 'admin' ? 'Reference Architecture' : 'Prototype'} name`}
                            value={newPrototypeName}
                            onChange={e => setNewPrototypeName(e.target.value)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" onClick={handleCloneConfirm}>
                            Clone
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Skeleton>
    );
};

export default ArchitectureCard;
