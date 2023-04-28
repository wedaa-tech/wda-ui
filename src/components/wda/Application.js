import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

function Application({
  application,
  setApplication,
  id,
  checkDuplicateAppName,
  isDuplicateAppName,
}) {
  const handleInputChange = (field, value) => {
    checkDuplicateAppName(id, field, value);
    setApplication((state) => ({
      ...state,
      [id]: {
        ...state[id],
        [field]: value,
      },
    }));
  };
  const handleDelete = () => {
    console.log("delApp");
  };
  const isErrorAppName =
    isDuplicateAppName || application.applicationName === "";
  const isErrorPackageName = application.packageName === "";
  const isErrorServerPort = application.serverPort === "";

  return (
    <>
      <AccordionItem>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              <FormControl display="flex" flexDirection="column">
                <FormControl isInvalid={isErrorAppName} isRequired>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <FormLabel style={{ width: "250px" }}>
                      Application Name
                    </FormLabel>
                    <Input
                      placeholder="Application"
                      key="applicationName"
                      name="applicationName"
                      onChange={({ target }) =>
                        handleInputChange("applicationName", target.value)
                      }
                      defaultValue={application.applicationName}
                      type="text"
                      marginRight="10px"
                      style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
                      sx={{
                        border: "none",
                        boxShadow: "none",
                        outline: "none",
                        "&:focus": {
                          outline: "none",
                          boxShadow: "none",
                        },
                      }}
                    />
                  </div>
                  <Box>
                    {!isErrorAppName ? (
                      <div style={{ marginBottom: "0px" }}></div>
                    ) : (
                      <FormErrorMessage fontSize="10px" marginTop="5px">
                        <WarningIcon marginRight="5px" marginLeft="180px" />
                        {isDuplicateAppName
                          ? "Application name already exists"
                          : "Required"}
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
              key="applicationType"
              name="applicationType"
              onChange={({ target }) =>
                handleInputChange("applicationType", target.value)
              }
              marginBottom="10px"
              defaultValue={application.applicationType}
            >
               {application.applicationType !== "gateway" && (
    <option value="gateway">UI + Gateway</option>)}
              <option value="microservice">Microservice</option>
              {/* <option value="monolithic">Monolithic</option> */}
            </Select>
            <FormControl isInvalid={isErrorPackageName} isRequired>
              <FormLabel>Package Name</FormLabel>
              <Input
                placeholder="com.mycompany.myapp"
                key="packageName"
                name="packageName"
                onChange={({ target }) =>
                  handleInputChange("packageName", target.value)
                }
                defaultValue={application.packageName}
                type="text"
                style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
              />
              {!isErrorPackageName ? (
                <div style={{ marginBottom: "10px" }}></div>
              ) : (
                <FormErrorMessage
                  marginBottom="10px"
                  fontSize="10px"
                  marginTop="5px"
                >
                  <WarningIcon marginRight="5px" />
                  Required
                </FormErrorMessage>
              )}
            </FormControl>
            <FormLabel>Authentication Type</FormLabel>
            <Select
              key="authenticationType"
              name="authenticationType"
              onChange={({ target }) =>
                handleInputChange("authenticationType", target.value)
              }
              marginBottom="10px"
              defaultValue={application.authenticationType}
            >
              <option value="oauth2">OAuth2</option>
              <option value="jwt">JWT</option>
              <option value="session">Session</option>
            </Select>
            <FormLabel>Database Type</FormLabel>
            <Select
              key="databaseType"
              name="databaseType"
              onChange={({ target }) =>
                handleInputChange("databaseType", target.value)
              }
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
              key="prodDatabaseType"
              name="prodDatabaseType"
              onChange={({ target }) =>
                handleInputChange("prodDatabaseType", target.value)
              }
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
            <FormLabel>Client Framework</FormLabel>
            <Select
              key="clientFramework"
              name="clientFramework"
              onChange={({ target }) =>
                handleInputChange("clientFramework", target.value)
              }
              marginBottom="10px"
              defaultValue={application.clientFramework}
            >
              <option value="react">React</option>
              <option value="angular">Angular</option>
              <option value="vue">Vue</option>
              <option value="svelte">Svelte</option>
              <option value="no">No</option>
            </Select>
            <FormLabel>Service Discovery Type</FormLabel>
            <Select
              key="serviceDiscoveryType"
              name="serviceDiscoveryType"
              onChange={({ target }) =>
                handleInputChange("serviceDiscoveryType", target.value)
              }
              marginBottom="10px"
              defaultValue={application.serviceDiscoveryType}
            >
              <option value="eureka">Eureka</option>
              <option value="consul">Consul</option>
              <option value="no">No</option>
            </Select>
            <FormControl isInvalid={isErrorServerPort} isRequired>
              <FormLabel>Service Port</FormLabel>
              <Input
                placeholder="9000"
                key="serverPort"
                name="serverPort"
                onChange={({ target }) =>
                  handleInputChange("serverPort", target.value)
                }
                defaultValue={application.serverPort}
                style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
                type="number"
                min={3000}
                max={9000}
              />
              {!isErrorServerPort ? (
                <div style={{ marginBottom: "10px" }}></div>
              ) : (
                <FormErrorMessage
                  marginBottom="10px"
                  fontSize="10px"
                  marginTop="5px"
                >
                  <WarningIcon marginRight="5px" />
                  Required
                </FormErrorMessage>
              )}
            </FormControl>
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
