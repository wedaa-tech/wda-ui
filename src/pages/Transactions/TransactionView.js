import React, { useEffect, useState } from 'react';
import { Box, Flex, Image, Input, Text, Button, useToast } from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useKeycloak } from '@react-keycloak/web';
import wedaa from '../../assets/wedaa_logo.png';
import Pagination from '../../components/Pagination';
import Constants from '../../Constants';

const Transactions = () => {
    const { initialized, keycloak } = useKeycloak();
    const [transactions, setTransactions] = useState([]);
    const [userCredits, setUserCredits] = useState(0);
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [showRechargeInput, setShowRechargeInput] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const limit = 7;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const { transactionStatus } = Constants;
    const paginate = pageNumber => setCurrentPage(pageNumber);
    const toast = useToast({
        containerStyle: {
            width: '500px',
            maxWidth: '100%',
        },
    });

    useEffect(() => {
        fetchTransactions();
    }, [currentPage]);

    useEffect(() => {
        fetchCredits();
    }, [initialized, keycloak]);

    const fetchTransactions = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/transactions?page=${currentPage}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
            });
            const result = await response.json();
            const modifiedTransactions = result.transactions.map(transaction => ({
                ...transaction,
                imageUrl: transaction.imageUrl || wedaa,
                projectName: transaction.projectName ? `Prototype ${transaction.projectName}` : 'Admin',
            }));
            setTransactions(modifiedTransactions);
            setTotalTransactions(result.length);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCredits = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/credits`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
            });
            const { availableCredits } = await response.json();
            setUserCredits(availableCredits || 0);
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggle = index => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const handleRecharge = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/credits/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
                body: JSON.stringify({
                    credits: rechargeAmount,
                    status: transactionStatus.REQUESTED,
                }),
            });
            if (response.ok) {
                const res = await response.json();
                res.projectName = 'Admin';
                res.imageUrl = wedaa;
                setTransactions(prev => [res, ...prev.slice(0, limit - 1)]);
                setTotalTransactions(prev => prev + 1);
                toast({
                    title: `Request for ${rechargeAmount} Credits is submitted. Waiting for Approval from Admin.`,
                    status: 'success',
                    duration: 3000,
                    variant: 'left-accent',
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Failed to Request. Please Try Again Later',
                    status: 'error',
                    duration: 3000,
                    variant: 'left-accent',
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error(error);
        }
        setRechargeAmount('');
        setShowRechargeInput(false);
    };

    const transactionStatusMessages = {
        [transactionStatus.PENDING]: 'Services are being Generated.',
        [transactionStatus.REQUESTED]: 'Waiting for Approval from Admin.',
        [transactionStatus.CREDITED]: credits => `Admin credited ${credits} credits.`,
        [transactionStatus.REJECTED]: 'Transaction Failed.'
    };

    return (
        <Flex justifyContent="center" mt={'8'}>
            <Box>
                <Box p={3} mb={4} width={{ base: '100%', lg: '820px' }} bg={'white'} boxShadow="md" borderColor="transparent">
                    <Text fontSize="2xl" fontWeight="bold" mb="16px">
                        Transactions
                    </Text>
                    {transactions.map((transaction, index) => (
                        <Box
                            key={transaction._id}
                            p={4}
                            mb={0}
                            width="100%"
                            bg={'white'}
                            borderColor="transparent"
                            borderTop="1px solid #D3D3D3"
                            borderBottom="1px solid #D3D3D3"
                        >
                            <Flex alignItems="center" justifyContent="space-between">
                                <Flex alignItems="center">
                                    <Image
                                        src={transaction.imageUrl}
                                        border="1px"
                                        borderRadius="20%"
                                        alt={transaction.projectName}
                                        boxSize="50px"
                                        borderColor={'#D3D3D3'}
                                        mr={4}
                                    />
                                    <Flex flexDirection="column">
                                        <Text fontSize="lg" fontWeight mb="4px">
                                            {transaction.projectName}
                                        </Text>
                                        <Text color="gray.600">{transaction.subtitle}</Text>
                                    </Flex>
                                </Flex>
                                <Flex alignItems="center">
                                    <Box
                                        ml="-10px"
                                        mr={2}
                                        style={{ textDecoration: transaction.status === transactionStatus.REJECTED ? 'line-through' : 'none' }}
                                    >
                                        <span
                                            style={{
                                                color:
                                                    transaction.status === transactionStatus.CREDITED
                                                        ? 'green'
                                                        : transaction.status === transactionStatus.DEBITED
                                                        ? 'red'
                                                        : transaction.status === transactionStatus.REJECTED
                                                        ? 'black'
                                                        : 'orange',
                                            }}
                                        >
                                            {transaction.status === transactionStatus.CREDITED ? '+' : transaction.status === transactionStatus.DEBITED ? '-' : ' '}
                                            {Math.abs(transaction.credits)}
                                        </span>
                                    </Box>
                                    {transaction.status === transactionStatus.REJECTED && <span style={{ color: 'red' }}>Failed</span>}
                                    <Box onClick={() => handleToggle(index)} cursor="pointer">
                                        {expandedIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                                    </Box>
                                </Flex>
                            </Flex>
                            <Box mt={4} style={{ display: expandedIndex === index ? 'block' : 'none' }}>
                                <Box bg="#F3F3F3" p={4} borderRadius="md">
                                    {transaction.status !== transactionStatus.PENDING && transaction.services && (
                                        <>
                                            Services Generated :
                                            <Text color="gray.600">
                                                {Object.values(transaction.services).map((service, serviceIndex) => (
                                                    service?.dbmlData && (
                                                        <React.Fragment key={serviceIndex}>
                                                            {service.applicationName}
                                                            {serviceIndex < Object.values(transaction.services).filter(service => service?.dbmlData).length - 1 && ' '}
                                                        </React.Fragment>
                                                    )
                                                ))}
                                            </Text>
                                        </>
                                    )}
                                    {transaction.status in transactionStatusMessages && (
                                        <>{typeof transactionStatusMessages[transaction.status] === 'function' ? transactionStatusMessages[transaction.status](transaction.credits) : transactionStatusMessages[transaction.status]}</>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box ml={4}>
                <Box
                    p={4}
                    width="200px"
                    bg={'white'}
                    borderColor="transparent"
                    borderTop="1px solid #D3D3D3"
                    borderBottom="2px solid #D3D3D3"
                >
                    <Flex alignItems="center" justifyContent="space-between" mb={4}>
                        <Text fontSize="lg" fontWeight>
                            Credit Balance
                        </Text>
                        <Text color="green.500">{userCredits}</Text>
                    </Flex>
                    {showRechargeInput ? (
                        <>
                            <Flex alignItems="center" mb={4}>
                                <Text color="blue.500" fontSize="sm">
                                    Credits:
                                </Text>
                                <Input
                                    type="number"
                                    value={rechargeAmount}
                                    onChange={e => setRechargeAmount(e.target.value)}
                                    ml={2}
                                    w="90px"
                                    h="24px"
                                />
                            </Flex>
                            <Flex alignItems="center">
                                <Button
                                    onClick={handleRecharge}
                                    disabled={!rechargeAmount}
                                    cursor={rechargeAmount ? 'pointer' : 'not-allowed'}
                                >
                                    Recharge
                                </Button>
                            </Flex>
                        </>
                    ) : (
                        <Flex alignItems="center">
                            <Text color="blue.500" fontSize="sm" cursor="pointer" onClick={() => setShowRechargeInput(true)}>
                                Recharge
                            </Text>
                        </Flex>
                    )}
                </Box>
            </Box>
            <Pagination itemsPerPage={limit} totalItems={totalTransactions} paginate={paginate} />
        </Flex>
    );
};

export default Transactions;
