import { useEffect } from 'react';
import { Heading, Container } from "@chakra-ui/react";

export default function DocHome() {
  useEffect(() => {
    const timeout = setTimeout(() => {
     
      window.open(process.env.REACT_APP_DOCS_URL);
    }, 10);

    return () => clearTimeout(timeout);
  }, []);

    return (
      <Container maxW="2xl" marginTop="16px">
        <Heading size="xl" fontWeight="extrabold" mb={4} marginBottom="50px">
        Redirecting...
        </Heading>
      </Container>
    );
  }
  
