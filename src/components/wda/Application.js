import React, { useEffect } from "react";
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
  Editable,
  EditableInput,
  EditablePreview,
  Checkbox,
  CheckboxGroup,
  Stack,
  Button,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { applicationPreFlightTemplate } from "./assert";

function Application({ application, setApplication, id, entity }) {
  const [inputs, setInputs] = useState(applicationPreFlightTemplate);

  useEffect(() => {
    const storedData = localStorage.getItem("application");
      if (storedData) {
        const applicationData = JSON.parse(storedData);
        const componentData = applicationData[id];
        if (componentData) {
          setInputs(componentData);
        }
      }
    }, [id]);
    
    const handleInputChange = (field, value) => {
      setInputs((state) => ({
        ...state,
        [field]: value,
      }));
    
      setApplication((state) => ({
        ...state,
        [id]: {
          ...state[id],
          [field]: value,
        },
      }));
    
      const storedData = localStorage.getItem("application");
      const applicationData = storedData ? JSON.parse(storedData) : {};
      localStorage.setItem(
        "application",
        JSON.stringify({
          ...applicationData,
          [id]: {
            ...applicationData[id],
            [field]: value,
          },
        })
      );
    };

  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
          <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                height: "40px",
              }}
            >
              <FormLabel style={{ width: "250px" }}>Application Name</FormLabel>
              <Input
                placeholder="Application"
                key="applicationName"
                name="applicationName"
                onChange={({ target }) =>
                  handleInputChange("applicationName", target.value)
                }
                marginBottom="10px"
                value={inputs.applicationName}
                type="text"
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
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <FormControl>
          <FormLabel>Application Type</FormLabel>
          <Select
            key="applicationType"
            name="applicationType"
            onChange={({ target }) => handleInputChange('applicationType', target.value)}
            marginBottom="10px"
            value={inputs.applicationType}
          >
            <option value="gateway">Gateway</option>
            <option value="microservices">Microservices</option>
            <option value="monolithic">Monolithic</option>
          </Select>
          <FormLabel>Package Name</FormLabel>
          <Input
            placeholder="com.mycompany.myapp"
            key="packageName"
            name="packageName"
            onChange={({ target }) => handleInputChange('packageName', target.value)}
            marginBottom="10px"
            value={inputs.packageName}
            type="text"
          />
          <FormLabel>Authentication Type</FormLabel>
          <Select
            key="authenticationType"
            name="authenticationType"
            onChange={({ target }) => handleInputChange('authenticationType', target.value)}
            marginBottom="10px"
            value={inputs.authenticationType}
          >
            <option value="oauth2">OAuth2</option>
            <option value="jwt">JWT</option>
            <option value="session">Session</option>
          </Select>
          <FormLabel>Database Type</FormLabel>
          <Select
            key="databaseType"
            name="databaseType"
            onChange={({ target }) => handleInputChange('databaseType', target.value)}
            marginBottom="10px"
            value={inputs.databaseType}
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
            onChange={({ target }) => handleInputChange('prodDatabaseType', target.value)}
            marginBottom="10px"
            value={inputs.prodDatabaseType}
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
            onChange={({ target }) => handleInputChange('clientFramework', target.value)}
            marginBottom="10px"
            value={inputs.clientFramework}
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
            onChange={({ target }) => handleInputChange('serviceDiscoveryType', target.value)}
            marginBottom="10px"
            value={inputs.serviceDiscoveryType}
          >
            <option value="eureka">Eureka</option>
            <option value="consul">Consul</option>
            <option value="no">No</option>
          </Select>
          <FormLabel>Service Port</FormLabel>
          <Input
            placeholder="9000"
            key="serverPort"
            name="serverPort"
            onChange={({ target }) => handleInputChange('serverPort', target.value)}
            marginBottom="10px"
            value={inputs.serverPort}
            type="number"
            min={3000} 
            max={9000}
          />
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
              value={inputs.serverPort}
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
     
      <Button
        size="xs"
        leftIcon={<DeleteIcon />}
        // onClick={handleDelete}
        marginTop="10px"
        marginBottom="10px"
      >
        Delete
      </Button>
    </AccordionItem>
  );
}

export default Application;
