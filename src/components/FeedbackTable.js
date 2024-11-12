import { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Spinner,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
} from '@chakra-ui/react';
import { useKeycloak } from '@react-keycloak/web';
import Pagination from './Pagination';

const FeedbackPage = () => {
    const [feedbackData, setFeedbackData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [FeedbacksPerPage] = useState(7);
    const { initialized, keycloak } = useKeycloak();

    const fetchFeedbackData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/feedback`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
            });
            const data = await response.json();
            setFeedbackData(data.data);
        } catch (error) {
            console.error('Error fetching feedback data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbackData();
    }, [initialized, keycloak?.token]);

    const indexOfLastPost = currentPage * FeedbacksPerPage;
    const indexOfFirstPost = indexOfLastPost - FeedbacksPerPage;
    const currentFeedbacks = feedbackData.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <Container maxW="container.lg" mt={10}>
            <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
                <Heading as="h1" size="xl" mb={6}>
                    Feedback
                </Heading>
                {loading ? (
                    <Spinner size="lg" />
                ) : (
                    <Table variant="simple" size="lg">
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Email</Th>
                                <Th>Review</Th>
                                <Th>Rating</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {currentFeedbacks.map((feedback, index) => (
                                <Tr key={index} className={index === currentFeedbacks.length - 1 ? 'last-row' : ''}>
                                    <Td>{feedback?.name || 'Anonymous'}</Td>
                                    <Td>{feedback.email || 'Anonymous'}</Td>
                                    <Td>
                                        {feedback.description.length > 10 ? (
                                            <Popover>
                                                <PopoverTrigger>
                                                    <Box
                                                        as="span"
                                                        cursor="pointer"
                                                        _hover={{ textDecoration: 'underline', color: 'blue.500' }}
                                                    >
                                                        {feedback.description.slice(0, 10) + '...'}
                                                    </Box>
                                                </PopoverTrigger>
                                                <PopoverContent maxHeight="200px" overflowY="auto">
                                                    <PopoverBody>{feedback.description}</PopoverBody>
                                                </PopoverContent>
                                            </Popover>
                                        ) : (
                                            feedback.description
                                        )}
                                    </Td>
                                    <Td>{feedback.rating}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}
            </Box>
            <Pagination itemsPerPage={FeedbacksPerPage} totalItems={feedbackData.length} paginate={paginate} />
        </Container>
    );
};

export default FeedbackPage;
