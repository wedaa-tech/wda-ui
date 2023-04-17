import React from "react";
import { Box, Heading, Text, Button, Image, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import logo from "../assets/TIC.png"

function Home() {
  return (
    <Box px={4} py={12} mx="auto" maxW="7xl">
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: 10, md: 4 }}
      >
        <Box flex="1">
          <Heading size="xl" fontWeight="extrabold" mb={4}>
            Welcome to TechCo
          </Heading>
          <Text fontSize="xl" mb={8}>
            We are a technology company dedicated to building innovative
            products that make people's lives easier.
          </Text>
          <Link to="/products">
            <Button size="lg" colorScheme="blue">
              View Our Products
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
    </Box>
  );
}

export default Home;
