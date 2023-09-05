import React, { useState } from "react";
import {
  Box,
  Text,
  Button,
  Image,
  Stack,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import logo from "../assets/success.png";
import Footer from "../components/Footer";

const SuccessPage = ({ isLoading }) => {
  return (
    <div
      style={{ display: "flex", textAlign: "center", justifyContent: "center" }}
    >
      <div>
        <Box flex="1">
          <Image src={logo} alt="Success" mt={20} />
        </Box>
        <Box flex="1">
          <Text fontSize="xl" mt={10} mb={4} fontWeight="600">
            Project is successfully generated
          </Text>
          <Text fontSize="md" mb={8} color="#909090">
            You can view your files in the downloaded zip
          </Text>
          <Link to="/canvasToCode">
            <Button size="lg" colorScheme="blue">
              CanvasToCode
            </Button>
          </Link>
        </Box>
      </div>
      <Footer />
    </div>
  );
};

export default SuccessPage;
