import React from "react";
import { Heading, Button, Container } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function Products() {
  return (
    <>
      <Container maxW="2xl" marginTop="16px">
        <Heading size="xl" fontWeight="extrabold" mb={4} marginBottom="50px">
          Products
        </Heading>
        <Link to="/wda">
          <Button
            size="lg"
            colorScheme="blue"
            style={{ minWidth: "120px", marginBottom: "20px" }}
          >
            WDA
          </Button>
        </Link>
        <br />
        <Heading size="md" fontWeight="extrabold" mb={4}>
          Well-Defined Architecture
        </Heading>
        <div>
          A well-defined architecture is a clear and documented framework that
          outlines the components and their interactions in a system. It should
          be easy to understand, flexible, scalable, maintainable, secure,
          optimized for performance, and well-documented. It's critical for the
          success of any software project.
        </div>
        <br />
        <Link to="/wdi">
          <Button
            size="lg"
            colorScheme="blue"
            style={{ minWidth: "120px", marginBottom: "20px" }}
          >
            WDI
          </Button>
        </Link>
        <Heading size="md" fontWeight="extrabold" mb={4}>
          Well-Defined Infrastructure
        </Heading>
        <div>
          A well-defined infrastructure is a clear and documented set of
          hardware, software, and network components necessary to support a
          system or application. It should be scalable, available, secure,
          performant, manageable, resilient, and well-documented to ensure
          reliable, secure, and efficient operations while minimizing downtime
          and reducing costs.
        </div>
      </Container>
    </>
  );
}

export default Products;
