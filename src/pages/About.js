import React from "react";
import { Heading, Button, Container } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function About() {
  return (
    <Container maxW="2xl" marginTop="16px">
      <Heading size="xl" fontWeight="extrabold" mb={4} marginBottom="50px">
        About
      </Heading>
    </Container>
  );
}

export default About;
