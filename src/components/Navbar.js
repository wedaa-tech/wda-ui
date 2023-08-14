import { Box, Flex, HStack, Button, Text, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import logo from "../assets/TIC_logo.png";
import { useKeycloak } from "@react-keycloak/web";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

export default function Header({ children }) {
  const color = "#ffffff";
  const bg = "#3182CE";
  const { keycloak, initialized } = useKeycloak();
  const location = useLocation();

  return (
    <Box bg={bg} py={4} px={6} shadow="md">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        maxW="7xl"
        mx="auto"
      >
        <Flex alignItems="center">
          <Link to="/">
            <Image
              src={logo}
              alt="App Logo"
              style={{
                width: "18px",
                height: "15px",
                marginRight: "30px",
                transform: "scale(3.5)",
              }}
            />
          </Link>
          <Link to="/">
            <Text fontSize="xl" fontWeight="bold" color={color}>
              TIC@coMakeIT
            </Text>
          </Link>
        </Flex>
        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
          <Link to="/canvasToCode">
            <Text
              fontSize="md"
              color={color}
              fontWeight={
                location.pathname === "/canvasToCode" ? "bold" : "normal"
              }
            >
              CanvasToCode
            </Text>
          </Link>
          <Link onClick={() => window.open(process.env.REACT_APP_DOCS_URL)}>
            <Text fontSize="md" color={color}>
              Docs
            </Text>
          </Link>
          {initialized && keycloak.authenticated && (
            <Link to="/projects">
              <Text
                fontSize="md"
                color={color}
                fontWeight={
                  location.pathname === "/projects" ? "bold" : "normal"
                }
              >
                Projects
              </Text>
            </Link>
          )}
          {/* <Link to="/about">
            <Text
              fontSize="md"
              color={color}
              fontWeight={location.pathname === "/about" ? "bold" : "normal"}
            >
              About
            </Text>
          </Link> */}
          <Link to="/contact">
            <Text
              fontSize="md"
              color={color}
              fontWeight={location.pathname === "/contact" ? "bold" : "normal"}
            >
              Contact
            </Text>
          </Link>
          {!keycloak.authenticated && (
            <Text
              fontSize="md"
              color={color}
              onClick={() =>
                keycloak.login({
                  redirectUri: process.env.REACT_APP_UI_BASE_URL + "projects",
                })
              }
              cursor="pointer"
            >
              Login
            </Text>
          )}

          {keycloak.authenticated && (
            <Text
              fontSize="md"
              color={color}
              cursor="pointer"
              onClick={() =>
                keycloak.logout({
                  redirectUri: process.env.REACT_APP_UI_BASE_URL,
                })
              }
            >
              Logout ({keycloak.tokenParsed.preferred_username})
            </Text>
          )}
        </HStack>
        <Box display={{ base: "block", md: "none" }}>
          <Button variant="ghost" colorScheme="blue" size="sm">
            Menu
          </Button>
        </Box>
      </Flex>
      {children}
    </Box>
  );
}
