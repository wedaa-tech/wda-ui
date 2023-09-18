import React from 'react';
import {
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    FormControl,
    FormLabel,
    Input,
    Select,
    CloseButton,
    FormErrorMessage,
} from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';

function Application({ application, setApplication, id, checkDuplicateAppName, isDuplicateAppName, handleDeleteApplication }) {
    const handleKeyPress = event => {
        const charCode = event.which ? event.which : event.keyCode;
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 8) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    };
    const handleInputChange = (field, value) => {
        checkDuplicateAppName(id, field, value);
        setApplication(state => ({
            ...state,
            [id]: {
                ...state[id],
                [field]: value,
            },
        }));
    };

    const handleDelete = () => {
        handleDeleteApplication(id);
    };
    const isErrorAppName = isDuplicateAppName || application.applicationName === '';
    const isErrorPackageName = application.packageName === '';
    const isErrorServerPort = application.serverPort === '';

    return (
        <>
            <AccordionItem>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                            <FormControl display="flex" flexDirection="column">
                                <FormControl isInvalid={isErrorAppName} isRequired>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <FormLabel style={{ width: '250px' }}>Application Name</FormLabel>
                                        <Input
                                            placeholder="Application"
                                            name="applicationName"
                                            onChange={({ target }) => handleInputChange('applicationName', target.value)}
                                            // onKeyPress={handleKeyPress}
                                            defaultValue={application.applicationName}
                                            type="text"
                                            marginRight="10px"
                                            style={{ border: '1px solid #cfcfcf', boxShadow: 'none' }}
                                            sx={{
                                                border: 'none',
                                                boxShadow: 'none',
                                                outline: 'none',
                                                '&:focus': {
                                                    outline: 'none',
                                                    boxShadow: 'none',
                                                },
                                            }}
                                        />
                                    </div>
                                    <Box>
                                        {!isErrorAppName ? (
                                            <div style={{ marginBottom: '0px' }}></div>
                                        ) : (
                                            <FormErrorMessage fontSize="10px" marginTop="5px">
                                                <WarningIcon marginRight="5px" marginLeft="180px" />
                                                {isDuplicateAppName ? 'Application name already exists' : 'Required'}
                                            </FormErrorMessage>
                                        )}
                                    </Box>
                                </FormControl>
                            </FormControl>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <CloseButton size="sm" bg="transparent" onClick={handleDelete} />
                </div>
                <AccordionPanel pb={4}>
                    <FormControl>
                        <FormLabel>Application Type</FormLabel>
                        <Select
                            name="applicationType"
                            onChange={({ target }) => handleInputChange('applicationType', target.value)}
                            marginBottom="10px"
                            defaultValue={application.applicationType}
                        >
                            <option value="microservice">Microservice</option>
                            <option value="gateway">UI + Gateway</option>
                            {/* <option value="monolithic">Monolithic</option> */}
                        </Select>
                        {application.applicationType === 'microservice' && (
                            <>
                                <FormLabel>Application Framework</FormLabel>
                                <Select
                                    name="applicationFramework"
                                    onChange={({ target }) => handleInputChange('applicationFramework', target.value)}
                                    marginBottom="10px"
                                    defaultValue={application.applicationFramework}
                                >
                                    <option value="java">JAVA</option>
                                    <option value="go">GO</option>
                                </Select>
                            </>
                        )}
                        <FormControl isInvalid={isErrorPackageName} isRequired>
                            <FormLabel>Package Name</FormLabel>
                            <Input
                                placeholder="com.mycompany.myapp"
                                name="packageName"
                                onChange={({ target }) => handleInputChange('packageName', target.value)}
                                defaultValue={application.packageName}
                                type="text"
                                style={{ border: '1px solid #cfcfcf', boxShadow: 'none' }}
                            />
                            {!isErrorPackageName ? (
                                <div style={{ marginBottom: '10px' }}></div>
                            ) : (
                                <FormErrorMessage marginBottom="10px" fontSize="10px" marginTop="5px">
                                    <WarningIcon marginRight="5px" />
                                    Required
                                </FormErrorMessage>
                            )}
                        </FormControl>
                        <FormLabel>Authentication Type</FormLabel>
                        <Select
                            name="authenticationType"
                            onChange={({ target }) => handleInputChange('authenticationType', target.value)}
                            marginBottom="10px"
                            defaultValue={application.authenticationType}
                        >
                            <option value="oauth2">OAuth2</option>
                            <option value="jwt">JWT</option>
                            <option value="session">Session</option>
                        </Select>
                        <FormLabel>Database Type</FormLabel>
                        <Select
                            name="databaseType"
                            onChange={({ target }) => handleInputChange('databaseType', target.value)}
                            marginBottom="10px"
                            defaultValue={application.databaseType}
                        >
                            <option value="sql">SQL</option>
                            <option value="mongodb">Mongodb</option>
                            <option value="cassandra">Cassandra</option>
                            <option value="couchbase">Couchbase</option>
                            <option value="no">No</option>
                        </Select>
                        <FormLabel>Production Database Type</FormLabel>
                        <Select
                            name="prodDatabaseType"
                            onChange={({ target }) => handleInputChange('prodDatabaseType', target.value)}
                            marginBottom="10px"
                            defaultValue={application.prodDatabaseType}
                        >
                            <option value="postgresql">PostgreSQL</option>
                            <option value="mysql">MySQL</option>
                            <option value="mariadb">MariaDB</option>
                            <option value="mssql">MsSQL</option>
                            <option value="oracle">Oracle</option>
                            <option value="no">No</option>
                        </Select>
                        {application.applicationType === 'gateway' && (
                            <>
                                <FormLabel>Client Framework</FormLabel>
                                <Select
                                    name="clientFramework"
                                    onChange={({ target }) => handleInputChange('clientFramework', target.value)}
                                    marginBottom="10px"
                                    defaultValue={application.clientFramework}
                                >
                                    <option value="react">React</option>
                                    <option value="angular">Angular</option>
                                    <option value="vue">Vue</option>
                                    <option value="svelte">Svelte</option>
                                    <option value="no">No</option>
                                </Select>
                            </>
                        )}
                        <FormLabel>Service Discovery Type</FormLabel>
                        <Select
                            name="serviceDiscoveryType"
                            onChange={({ target }) => handleInputChange('serviceDiscoveryType', target.value)}
                            marginBottom="10px"
                            defaultValue={application.serviceDiscoveryType}
                        >
                            <option value="eureka">Eureka</option>
                            <option value="consul">Consul</option>
                            <option value="no">No</option>
                        </Select>
                        {application.applicationType === 'microservice' && (
                            <>
                                <FormLabel>Message Broker</FormLabel>
                                <Select
                                    name="messageBroker"
                                    onChange={({ target }) => handleInputChange('messageBroker', target.value)}
                                    marginBottom="10px"
                                    defaultValue={application.messageBroker}
                                >
                                    <option value="rabbitmq">RabbitMQ</option>
                                    <option value="kafka">Kafka</option>
                                    <option value="pulsar">Pulsar</option>
                                    <option value="no">No</option>
                                </Select>
                            </>
                        )}
                        <FormControl isInvalid={isErrorServerPort} isRequired>
                            <FormLabel>Service Port</FormLabel>
                            <Input
                                placeholder="9000"
                                name="serverPort"
                                onChange={({ target }) => handleInputChange('serverPort', target.value)}
                                defaultValue={application.serverPort}
                                style={{ border: '1px solid #cfcfcf', boxShadow: 'none' }}
                                type="number"
                                min={3000}
                                max={9000}
                            />
                            {!isErrorServerPort ? (
                                <div style={{ marginBottom: '10px' }}></div>
                            ) : (
                                <FormErrorMessage marginBottom="10px" fontSize="10px" marginTop="5px">
                                    <WarningIcon marginRight="5px" />
                                    Required
                                </FormErrorMessage>
                            )}
                        </FormControl>
                        {application.applicationType === 'gateway' && (
                            <>
                                <FormLabel>Enable Reminder Example</FormLabel>
                                <Select
                                    name="withExample"
                                    onChange={({ target }) => handleInputChange('withExample', target.value)}
                                    marginBottom="10px"
                                    defaultValue={application.withExample}
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </Select>
                            </>
                        )}
                        {/* <NumberInput max={30000} min={9000}>
      <NumberInputField
        placeholder="9000"
        key="serverPort"
        name="serverPort"
        // onChange={({ target }) =>
        //   setInputs((state) => ({
        //     ...state,
        //     serverPort: target.value,
        //   }))
        // }
        onChange={({ target }) => handleInputChange('serverPort', target.value)}
        marginBottom="10px"
        defaultValue={application.serverPort}
      />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput> */}

                        {/* <FormLabel>Entities</FormLabel>
    <CheckboxGroup colorScheme="green">
      <Stack spacing={[1, 5]} direction={["column", "row"]}>
        {Object.keys(entity).map((data, id) => {
          return (
            <Checkbox key={id} value="a">
              {JSON.stringify(entity[id])}
            </Checkbox>
          );
        })}
      </Stack>
    </CheckboxGroup> */}
                    </FormControl>
                </AccordionPanel>
            </AccordionItem>
        </>
    );
}

export default Application;
