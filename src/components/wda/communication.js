import React, { useState, useEffect } from "react";
import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Input,
  Text,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { communicationPreFlightTemplate } from "./assert";

function Communication({ id, communication, setCommunication }) {
  const [inputs, setInputs] = useState(communicationPreFlightTemplate);
  
  useEffect(() => {
  const storedData = localStorage.getItem("communication");
    if (storedData) {
      const communicationData = JSON.parse(storedData);
      const componentData = communicationData[id];
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
  
    setCommunication((state) => ({
      ...state,
      [id]: {
        ...state[id],
        [field]: value,
      },
    }));
  
    const storedData = localStorage.getItem("communication");
    const communicationData = storedData ? JSON.parse(storedData) : {};
    localStorage.setItem(
      "communication",
      JSON.stringify({
        ...communicationData,
        [id]: {
          ...communicationData[id],
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
            <Text>Communication</Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <FormControl display="flex" flexDirection="row">
          <FormLabel width="150px" alignSelf="center">
            Client Name
          </FormLabel>
          <Input
            placeholder="Client"
            key="clientName"
            name="clientName"
            onChange={({ target }) => handleInputChange('clientName', target.value)}
            marginBottom="10px"
            value={inputs.clientName}
            type="text"
          />
        </FormControl>
        <FormControl display="flex" flexDirection="row">
          <FormLabel width="150px" alignSelf="center">
            Server Name
          </FormLabel>
          <Input
            placeholder="Server"
            key="serverName"
            name="serverName"
            onChange={({ target }) => handleInputChange('serverName', target.value)}
            marginBottom="10px"
            value={inputs.serverName}
            type="text"
          />
        </FormControl>
        <Button
          size="xs"
          leftIcon={<DeleteIcon />}
          marginTop="10px"
        >
          Delete
        </Button>
      </AccordionPanel>
    </AccordionItem>
  );
}

export default Communication;
