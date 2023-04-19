import React from "react";
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

function Communication({ id, communication, setCommunication }) {
  
  const handleInputChange = (field, value) => {
    setCommunication((state) => ({
      ...state,
      [id]: {
        ...state[id],
        [field]: value,
      },
    }));
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
            defaultValue={communication.clientName}
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
            defaultValue={communication.serverName}
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
