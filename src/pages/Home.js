import React from "react";
import { Box, Text, Button, Image, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import logo from "../assets/TIC.png";
import Footer from "../components/Footer";

function Home() {
  return (
    <Box px={4} py={12} mx="auto" maxW="7xl">
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: 10, md: 4 }}
      >
        <Box flex="1">
          {/* <Heading size="xl" fontWeight="extrabold" mb={4}>
            Welcome to Technology Innovation Center (TIC)
          </Heading> */}
          <Text fontSize="l" mb={8}>
            The Technology Innovation Center (TIC) at coMakeIT serves as a
            dedicated facility for exploring new ideas, building cutting-edge
            technologies, and developing innovative solutions for their products
            and services. This center plays a vital role in accelerating the
            company's product development process by establishing robust
            foundations through continuous innovation. TIC's primary focus
            revolves around pioneering technologies of the future, ensuring
            adaptability to the latest advancements in the dynamic software
            industry.
          </Text>
          <Link to="/canvasToCode">
            <Button size="lg" colorScheme="blue">
              CanvasToCode
            </Button>
          </Link>
        </Box>
        <Box flex="1">
          <Image
            src={logo}
            alt="TechCo hero image"
            rounded="lg"
            shadow="lg"
            objectFit="cover"
            objectPosition="center"
            h={{ base: "auto", md: "70vh" }}
          />
        </Box>
      </Stack>
      <Footer />
    </Box>
  );
}

export default Home;
