import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Center, Text, Flex, useToast, Container, Box, Heading, Spinner } from '@chakra-ui/react';
import { useKeycloak } from '@react-keycloak/web';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Pagination from '../../components/Pagination';
import Constants from '../../Constants';

const PendingTransactions = () => {
    const toast = useToast({
        containerStyle: {
            width: '500px',
            maxWidth: '100%',
        },
    });
    const { initialized, keycloak } = useKeycloak();
    const limit = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const { transactionStatus } = Constants;

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const [data, setData] = useState([]);

    async function fetchPendingTransactions() {
        fetch(process.env.REACT_APP_API_BASE_URL + `/api/transactions/${transactionStatus.REQUESTED}?page=${currentPage}&limit=${limit}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
            },
        })
            .then(response => response.json())
            .then(result => {
                setData(result.transactions);
                setTotalTransactions(result.length);
            })
            .catch(error => console.error(error));
    }

    useEffect(() => {
        fetchPendingTransactions();
    }, [currentPage]);

    const handleSubmit = (transaction, status) => {
        fetch(process.env.REACT_APP_API_BASE_URL + '/api/transaction', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
            },
            body: JSON.stringify({
                transactionId: transaction._id,
                status: status,
                userId: transaction.user_id,
                credits: transaction.credits,
            }),
        })
            .then(result => {
                if (result.ok) {
                    toast({
                        title: `${status === transactionStatus.CREDITED ? 'Approval' : 'Rejection'} Successful: User ID ${transaction.user_id}, Credits ${transaction.credits}`,
                        status: 'success',
                        duration: 3000,
                        variant: 'left-accent',
                        isClosable: true,
                    });
                    fetchPendingTransactions();
                } else {
                    toast({
                        title: 'Failed to update transaction status',
                        status: 'error',
                        duration: 3000,
                        variant: 'left-accent',
                        isClosable: true,
                    });
                }
            })
            .catch(error => console.error(error));
    };

    return (
        <Container maxW="1200px" mt={10}>
            <Box p={8} borderWidth={1} borderRadius={18} boxShadow="lg">
                <Heading as="h1" size="xl" mb={6}>
                    Pending Transactions
                </Heading>
                <Center flexDirection="column">
                    {data && data.length > 0 ? (
                        <>
                            <Table variant="simple" maxWidth="840px">
                                <Thead>
                                    <Tr>
                                        <Th>S.No</Th>
                                        <Th>User_Id</Th>
                                        <Th>Credits Requested</Th>
                                        <Th>Credits Used</Th>
                                        <Th>Credits Available</Th>
                                        <Th textAlign={'center'}>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {data.map((transaction, index) => (
                                        <Tr key={transaction.id}>
                                            <Td>{(currentPage - 1) * limit + index + 1}</Td>
                                            <Td style={{ whiteSpace: 'nowrap' }}>{transaction.user_id}</Td>                                            <Td>{transaction.credits}</Td>
                                            <Td>{transaction?.creditsUsed || 0}</Td>
                                            <Td>{transaction?.creditsAvailable || 0}</Td>
                                            <Td>
                                                <Flex>
                                                    <Button
                                                        size="sm"
                                                        colorScheme="green"
                                                        mr={2}
                                                        leftIcon={<FaCheck />}
                                                        onClick={() => handleSubmit(transaction, transactionStatus.CREDITED)}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        colorScheme="red"
                                                        leftIcon={<FaTimes />}
                                                        onClick={() => handleSubmit(transaction, transactionStatus.REJECTED)}
                                                    >
                                                        Reject
                                                    </Button>
                                                </Flex>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                            <Pagination itemsPerPage={limit} totalItems={totalTransactions} paginate={paginate} />
                        </>
                    ) : (
                        <Center mt={8}>
                            <Text>No Pending Requests</Text>
                        </Center>
                    )}
                </Center>
            </Box>
        </Container>
    );
};

export default PendingTransactions;
