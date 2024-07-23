import React, { useEffect, useState } from 'react';
import { Box, Flex, Image, Input, Text, Button, useToast, FormControl, FormLabel, Icon, FormHelperText } from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useKeycloak } from '@react-keycloak/web';
import wedaa from '../../assets/wedaa_logo.png';
import Pagination from '../../components/Pagination';
import Constants from '../../Constants';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { InfoIcon } from '@chakra-ui/icons';

const Transactions = () => {
    const { initialized, keycloak } = useKeycloak();
    const [transactions, setTransactions] = useState([]);
    const [userCredits, setUserCredits] = useState(0);
    const [rechargeAmount, setRechargeAmount] = useState(20);
    const [showRechargeInput, setShowRechargeInput] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const limit = 7;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const { transactionStatus } = Constants;
    const [isFocused, setIsFocused] = useState(false);
    const [isError, setIsError] = useState(false);
    const history = useHistory();

    const handleRechargeChange = e => {
        const value = e.target.value;
        setRechargeAmount(value);
        if (!value || value <= 0 || value > 99) {
            setIsError(true);
        } else {
            setIsError(false);
        }
    };

    const handleChange = transaction => {
        var isAiGeneration = transaction?.blueprintId;
        if (isAiGeneration && transaction?.parentId) {
            const projectId = isAiGeneration;
            const architectureId = transaction.parentId;
            history.push(`/project/${architectureId}/architecture/${projectId}/details`);
        }
    };

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
            const response = await fetch(
                `${process.env.REACT_APP_CREDIT_SERVICE_URL}/api/usertransactions?page=${currentPage}&limit=${limit}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                    },
                },
            );
            const result = await response.json();
            const modifiedTransactions = result.transactions.map(transaction => ({
                ...transaction,
                imageUrl: transaction.imageUrl || wedaa,
                services: transaction?.services,
                blueprintId: transaction?.blueprintId,
                parentId: transaction?.parentId,
            }));
            setTransactions(modifiedTransactions);
            setTotalTransactions(result.length);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCredits = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_CREDIT_SERVICE_URL}/head`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
            });
            const { creditsAvailable } = await response.json();
            setUserCredits(creditsAvailable || 0);
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggle = index => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    function formatDateTime(timestamp) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };

        const date = new Date(timestamp);
        const formattedDate = date.toLocaleDateString('en-US', options).replace(',', '');
        const format = formattedDate.replace('at', ',');

        return `${format} `;
    }

    const handleRecharge = async () => {
        if (!rechargeAmount) return;
        try {
            var requestBody = {
                credits: parseInt(rechargeAmount),
                status: transactionStatus.REQUESTED,
            };
            const response = await fetch(`${process.env.REACT_APP_CREDIT_SERVICE_URL}/api/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
                body: JSON.stringify(requestBody),
            });
            if (response.ok) {
                var res = await response.json();
                res = { ...requestBody, id: res.result.InsertedID, imageUrl: wedaa, updatedAt: res.updatedAt };
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
        [transactionStatus.FAILED]: 'Transaction Failed.',
    };

    return (
        <Flex justifyContent="center" mt={'4'}>
            <Box>
                <Box p={3} mb={4} width={{ base: '100%', lg: '820px' }} bg={'white'} boxShadow="md" borderColor="transparent">
                    <Text fontSize="2xl" fontWeight="bold" mb="16px">
                        Transactions
                    </Text>
                    {transactions.length > 0 ? (
                        transactions.map((transaction, index) => (
                            <Box
                                key={transaction.id}
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
                                            alt={transaction.id}
                                            boxSize="50px"
                                            borderColor={'#D3D3D3'}
                                            mr={4}
                                        />
                                        <Flex flexDirection="column">
                                            <Text
                                                fontSize="lg"
                                                mb="1"
                                                onClick={() => handleChange(transaction)}
                                                style={{ cursor: transaction?.services ? 'pointer' : 'default' }}
                                            >
                                                {`Transaction Id: ${transaction.id}`}
                                            </Text>
                                            {/* <Text color="gray.600">{"Admin"}</Text> */}
                                            <Text color="gray.600">{formatDateTime(transaction.updatedAt)}</Text>
                                        </Flex>
                                    </Flex>
                                    <Flex alignItems="center">
                                        <div>
                                            <Box
                                                ml="10px"
                                                mr={2}
                                                style={{
                                                    textDecoration:
                                                        transaction.status === transactionStatus.FAILED ? 'line-through' : 'none',
                                                    textDecorationThickness: '0.1em',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        marginLeft: '10px',
                                                        color:
                                                            transaction.status === transactionStatus.CREDITED
                                                                ? 'green'
                                                                : transaction.status === transactionStatus.DEBITED
                                                                ? 'red'
                                                                : transaction.status === transactionStatus.FAILED
                                                                ? 'black'
                                                                : 'orange',
                                                    }}
                                                >
                                                    {transaction.status === transactionStatus.CREDITED
                                                        ? '+'
                                                        : transaction.status === transactionStatus.DEBITED
                                                        ? '-'
                                                        : ' '}
                                                    {Math.abs(transaction.credits)}
                                                </div>
                                            </Box>
                                            {transaction.status === transactionStatus.FAILED && (
                                                <div
                                                    style={{
                                                        fontSize: '10px',
                                                        color: 'red',
                                                        marginLeft: `${((transaction.credits.toString().length + 1) * 5).toString()}px`,
                                                        marginRight: '10px',
                                                    }}
                                                >
                                                    Failed
                                                </div>
                                            )}
                                        </div>
                                        <Box onClick={() => handleToggle(index)} cursor="pointer">
                                            {expandedIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                                        </Box>
                                    </Flex>
                                </Flex>
                                <Box mt={4} style={{ display: expandedIndex === index ? 'block' : 'none' }}>
                                    <Box bg="#F3F3F3" p={4} borderRadius="md">
                                        {transaction.status !== transactionStatus.PENDING &&
                                            transaction.status !== transactionStatus.FAILED &&
                                            transaction.services && (
                                                <>
                                                    Services Generated :
                                                    <Text as={'span'} color="gray.600" fontSize={12}>
                                                        {transaction.services.map((service, index) => (
                                                            <>
                                                                {' ' + service}
                                                                {index < transaction.services.length - 1 && ', '}
                                                            </>
                                                        ))}
                                                    </Text>
                                                </>
                                            )}
                                        {transaction.status in transactionStatusMessages && (
                                            <>
                                                {typeof transactionStatusMessages[transaction.status] === 'function'
                                                    ? transactionStatusMessages[transaction.status](transaction.credits)
                                                    : transactionStatusMessages[transaction.status]}
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Flex alignItems="center" justifyContent="center" flexDirection="column" minHeight="200px">
                            <Text fontSize="lg" color="gray.600" textAlign="center">
                                No transactions Available.
                            </Text>
                        </Flex>
                    )}
                </Box>
            </Box>
            <Box ml={4}>
                <Box
                    p={4}
                    width="240px"
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
                            <Box mb={4}>
                                <Text fontSize="sm">Recharge</Text>
                                <FormControl position="relative" mt={2}>
                                    <FormLabel
                                        position="absolute"
                                        top={isFocused || rechargeAmount ? '9px' : '14%'}
                                        left="10px"
                                        fontSize={isFocused || rechargeAmount ? '10px' : '16px'}
                                        color={'gray.400'}
                                        transform={isFocused || rechargeAmount ? 'translateY(-50%)' : 'translateY(0)'}
                                        transition="all 0.2s"
                                        pointerEvents="none"
                                    >
                                        Enter Credits
                                    </FormLabel>
                                    <Input
                                        type="number"
                                        value={rechargeAmount}
                                        paddingTop={4}
                                        onChange={e => handleRechargeChange(e)}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        _placeholder={{ color: 'transparent' }}
                                        borderColor={isError ? 'red.500' : 'gray.300'}
                                        focusBorderColor={isError ? 'red.500' : 'blue.500'}
                                    />
                                    {isError && (
                                        <FormHelperText fontSize="10px" color="red.500">
                                            Please enter valid credits between 1 and 99
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <Text mt={2} fontSize="11px" color="gray.500">
                                    <Icon as={InfoIcon} mr={1} />
                                    You can request up to 99 credits.
                                </Text>
                            </Box>
                            <Flex alignItems="center">
                                <Button
                                    onClick={handleRecharge}
                                    isDisabled={(!rechargeAmount || isError)}
                                    cursor={ 'pointer'}
                                    colorScheme="blue"
                                    size="sm"
                                    borderRadius="md"
                                    fontWeight="bold"
                                    _hover={{ bg: 'blue.600' }}
                                    _active={{ bg: 'blue.700' }}
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
