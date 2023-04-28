import React from "react";
import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
  FormControl,
  FormLabel,
  CloseButton,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

function Communication({ id, communication, setCommunication, application }) {
  // const isErrorClient = communication.clientName === "";
  // const isErrorServer = communication.serverName === "";

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
    <FormControl>
      {Object.values(application).filter((app) => app.applicationName !== "")
        .length >= 2 ? (
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
                <Text>Communication</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <CloseButton size="sm" bg="transparent" onClick={handleDelete} />
          </div>
          <AccordionPanel pb={4}>
            <FormControl display="flex" flexDirection="column">
              <FormControl
              // isInvalid={isErrorClient}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <FormLabel width="250px" alignSelf="center">
                    Client App Name
                  </FormLabel>
                  <Select
                    key="clientName"
                    name="clientName"
                    onChange={({ target }) =>
                      handleInputChange("clientName", target.value)
                    }
                    defaultValue={communication.clientName}
                    marginBottom="10px"
                  >
                    <option value="">-- Select --</option>
                    {Object.keys(application).map((id) => (
                      <option key={id} value={application[id].applicationName}>
                        {application[id].applicationName}
                      </option>
                    ))}
                  </Select>
                </div>
                {/* <Box>
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
            </Box> */}
              </FormControl>
            </FormControl>
            {/* {communication.clientName !== "" && ( */}
            <FormControl display="flex" flexDirection="column">
              <FormControl
              // isInvalid={isErrorServer}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <FormLabel width="250px" alignSelf="center">
                    Server App Name
                  </FormLabel>
                  <Select
                    key="serverName"
                    name="serverName"
                    onChange={({ target }) =>
                      handleInputChange("serverName", target.value)
                    }
                    defaultValue={communication.serverName}
                    marginBottom="10px"
                  >
                    <option value="">-- Select --</option>
                    {Object.keys(application)
                      .filter(
                        (id) =>
                          application[id].applicationName !==
                          communication.clientName
                      )
                      .map((id) => (
                        <option
                          key={id}
                          value={application[id].applicationName}
                        >
                          {application[id].applicationName}
                        </option>
                      ))}
                  </Select>
                </div>
                {/* <Box>
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
            </Box> */}
              </FormControl>
            </FormControl>
            {/* )} */}
          </AccordionPanel>
        </AccordionItem>
      ) : (
        <p
          style={{
            margin: "30px",
            textAlign: "center",
            fontSize: "14px",
            color: "red",
          }}
        >
          <WarningIcon marginRight="5px" />
          Communication can be enabled only when there are atleast 2
          applications defined
        </p>
      )}
    </FormControl>
  );
}

export default Communication;
