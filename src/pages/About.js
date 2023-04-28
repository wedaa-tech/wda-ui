import React from "react";
import { Heading, Container } from "@chakra-ui/react";

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
