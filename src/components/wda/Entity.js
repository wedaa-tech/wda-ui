import React, { useState, useEffect } from "react";
import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Select,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Stack,
  Divider,
  HStack,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  entityPreFlightTemplate,
  entityTuplesPreFlightTemplate,
} from "./assert";
function Entity({ id, entity, setEntity }) {
  const [entityTuples, setEntityTuples] = useState({
    0: entityTuplesPreFlightTemplate,
  });
  const [entityTuplesCounter, setEntityTuplesCounter] = useState(1);
  const addEntityTuples = () => {
    setEntityTuplesCounter((state) => state + 1);
    setEntityTuples((prev) => ({
      ...prev,
      [entityTuplesCounter]: entityTuplesPreFlightTemplate,
    }));
  };
  const [inputs, setInputs] = useState(entityPreFlightTemplate);

  useEffect(() => {
    const storedData = localStorage.getItem("entity");
    if (storedData) {
      const entityData = JSON.parse(storedData);
      const componentData = entityData[id];
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

    setEntity((state) => ({
      ...state,
      [id]: {
        ...state[id],
        [field]: value,
      },
    }));

    const storedData = localStorage.getItem("entity");
    const entityData = storedData ? JSON.parse(storedData) : {};
    localStorage.setItem(
      "entity",
      JSON.stringify({
        ...entityData,
        [id]: {
          ...entityData[id],
          [field]: value,
        },
      })
    );
  };

  // console.log("entityTuples", entityTuples);

  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <HStack>
            <Box as="span" flex="1" textAlign="left">
              <Editable defaultValue={"Entity"}>
                <EditablePreview />
                <EditableInput
                  onChange={({ target }) =>
                    handleInputChange("entityName", target.value)
                  }
                  value={inputs.entityName}
                />
              </Editable>
            </Box>
          </HStack>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        {Object.keys(entityTuples).map((entityTuples, id) => {
          return (
            <EntityInput
              id={id}
              key={id}
              entityTuples={entityTuples}
              setEntityTuples={setEntityTuples}
            />
          );
        })}
        <Button
          size="xs"
          leftIcon={<AddIcon />}
          onClick={addEntityTuples}
          marginRight="10px"
          marginTop="10px"
        >
          Add
        </Button>

        <Button size="xs" leftIcon={<DeleteIcon />} marginTop="10px">
          Delete
        </Button>
      </AccordionPanel>
    </AccordionItem>
  );
}

function EntityInput({ entityTuples, setEntityTuples, id }) {
  const [inputs, setInputs] = useState(entityTuplesPreFlightTemplate);

  useEffect(() => {
    const storedData = localStorage.getItem("entityTuples");
    if (storedData) {
      const entityTuplesData = JSON.parse(storedData);
      const componentData = entityTuplesData[id];
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

    setEntityTuples((state) => ({
      ...state,
      [id]: {
        ...state[id],
        [field]: value,
      },
    }));

    const storedData = localStorage.getItem("entityTuples");
    const entityTuplesData = storedData ? JSON.parse(storedData) : {};
    localStorage.setItem(
      "entityTuples",
      JSON.stringify({
        ...entityTuplesData,
        [id]: {
          ...entityTuplesData[id],
          [field]: value,
        },
      })
    );
  };

  return (
    <Stack direction="row" h="55px">
      <Editable defaultValue="Enter Attribute" width="150px">
        <EditablePreview />
        <EditableInput
          key="tupleName"
          name="tupleName"
          onChange={({ target }) =>
            handleInputChange("tupleName", target.value)
          }
          value={inputs.tupleName}
        />
      </Editable>
      <Divider orientation="vertical" />
      <Select
        width="400px"
        key="tupleType"
        name="tupleType"
        onChange={({ target }) => handleInputChange("tupleType", target.value)}
        value={inputs.tupleType}
      >
        <option value="String">String</option>
        <option value="Integer">Integer</option>
        <option value="Long">Long</option>
        <option value="BigDecimal">BigDecimal</option>
        <option value="Float">Float</option>
        <option value="Double">Double</option>
        <option value="Enum">Enum</option>
        <option value="Boolean">Boolean</option>
        <option value="LocalDate">LocalDate</option>
        <option value="ZonedDateTime">ZonedDateTime</option>
        <option value="Instant">Instant</option>
        <option value="ZonedDateTime">ZonedDateTime</option>
        <option value="Duration">Duration</option>
        <option value="UUID">UUID</option>
        <option value="AnyBlob">AnyBlob</option>
        <option value="ImageBlob">ImageBlob</option>
        <option value="TextBlob">TextBlob</option>
      </Select>
      <Divider orientation="vertical" />
      <Button
        size={"xs"}
        leftIcon={<DeleteIcon />}
        style={{ marginTop: "5px" }}
      >
        Delete
      </Button>
    </Stack>
  );
}

export default Entity;
