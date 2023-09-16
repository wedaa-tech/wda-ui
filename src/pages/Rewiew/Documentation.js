import React, { useEffect, useState } from "react";
import { useReactFlow } from "reactflow";
import { Table, Thead, Tbody, Tr, Th, Td, Box, Text } from "@chakra-ui/react";

const Documentation = ({ nodeData }) => {
  if (nodeData == null) {
    return <div>Please select an Component.</div>;
  } else {
    return (
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Property</Th>
            <Th>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(nodeData).map((key) => (
            <Tr key={key}>
              <Td>{key}</Td>
              <Td>{nodeData[key]}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  }
};

export default Documentation;
