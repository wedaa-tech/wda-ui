import React from "react";
import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Input,
  Text,
  FormControl,
  FormLabel,
  CloseButton,
  FormErrorMessage,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

function Communication({ id, communication, setCommunication }) {
  const isErrorClient = communication.clientName === "";
  const isErrorServer = communication.serverName === "";

  const handleInputChange = (field, value) => {
    setCommunication((state) => ({
      ...state,
      [id]: {
        ...state[id],
        [field]: value,
      },
    }));
  };
  const handleDelete = () => {
    console.log("delCom");
  };

  return (
    <AccordionItem>
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            <Text>Communication</Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <CloseButton size="sm" bg="transparent" onClick={handleDelete} />
      </div>
      <AccordionPanel pb={4}>
        <FormControl display="flex" flexDirection="column">
          <FormControl isInvalid={isErrorClient}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <FormLabel width="250px" alignSelf="center">
                Client App Name
              </FormLabel>
              <Input
                placeholder="Client"
                key="clientName"
                name="clientName"
                onChange={({ target }) =>
                  handleInputChange("clientName", target.value)
                }
                value={communication.clientName}
                type="text"
                style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
              />
            </div>
            <Box>
              {!isErrorClient ? (
                <div style={{ marginBottom: "10px" }}></div>
              ) : (
                <FormErrorMessage
                  marginBottom="10px"
                  fontSize="10px"
                  marginTop="5px"
                >
                  <WarningIcon marginRight="5px" marginLeft="180px" />
                  Required
                </FormErrorMessage>
              )}
            </Box>
          </FormControl>
        </FormControl>
        {communication.clientName !== "" && (
          <FormControl display="flex" flexDirection="column">
          <FormControl isInvalid={isErrorServer}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <FormLabel width="250px" alignSelf="center">Server App Name</FormLabel>
            <Input
              placeholder="Server"
              key="serverName"
              name="serverName"
              onChange={({ target }) =>
                handleInputChange("serverName", target.value)
              }
              defaultValue={communication.serverName}
              type="text"
              style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
            />
            </div>
            <Box>
            {!isErrorServer ? (
              <div style={{ marginBottom: "10px" }}></div>
            ) : (
              <FormErrorMessage
                marginBottom="10px"
                fontSize="10px"
                marginTop="5px"
              >
                <WarningIcon marginRight="5px" marginLeft="180px" />
                Required
              </FormErrorMessage>
            )}
            </Box>
            </FormControl>
          </FormControl>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}

export default Communication;
