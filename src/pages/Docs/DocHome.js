import {
  Container,
  Heading,
  Stack,
  Text,
  Button
} from '@chakra-ui/react';
import { useEffect } from 'react';

export default function DocHome() {
  useEffect(() => {
    const timeout = setTimeout(() => {
     
      window.location.replace('http://127.0.0.1:8000/');
    }, 10);

    return () => clearTimeout(timeout);
  }, []);

  return <>Redirecting..</>;

  return (
    <Container maxW="2xl" marginTop="16px">
     
    </Container>
  );
}
