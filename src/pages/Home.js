import React from "react";
import { Box, Heading, Text, Button, Image, Stack } from "@chakra-ui/react";
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
          <Heading size="xl" fontWeight="extrabold" mb={4}>
            Welcome to Technology Innovation Center (TIC)
          </Heading>
          <Text fontSize="l" mb={8}>
            Technology Innovation Center (TIC) at coMakeIT is a facility that
            enables exploration of new ideas, build technologies and solutions
            for its products and services. It helps the company to accelerate
            product development by laying down strong foundations through
            innovation. TIC primarily focuses on technology for the future,
            being ready to adapt to latest advancements in the software
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
