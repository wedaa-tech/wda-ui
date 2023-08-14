import React from "react";
import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

const centerStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "70vh",
};
const containerStyles = {
  marginTop: "16px",
  textAlign: "center",
};
const headingStyles = {
  fontWeight: "extrabold",
  marginBottom: "50px",
};
const marginStyle = {
  marginTop: "16px",
};

function Login() {
  const [action, setAction] = useState(null);
  const handleAction = (action) => {
    setAction(action);
  };
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);

  const isErrorUserName = submitClicked && userName === "";
  const isErrorPassword = submitClicked && password === "";

  return (
    <div style={centerStyles}>
      <div
        style={{
          ...containerStyles,
          border: "1px solid #cfcfcf",
          padding: "60px",
        }}
      >
        <Heading style={headingStyles}>Login</Heading>
        <FormControl display="flex" flexDirection="column">
          <FormControl isInvalid={isErrorUserName} isRequired>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormLabel style={{ width: "225px" }}>User Name</FormLabel>
              <Input
                type="text"
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                value={userName}
                style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
              />
            </div>
            {!isErrorUserName ? (
              <div style={{ marginBottom: "10px" }}></div>
            ) : (
              <FormErrorMessage
                marginBottom="10px"
                fontSize="10px"
                marginTop="5px"
              >
                <WarningIcon marginRight="5px" marginLeft="150px" />
                Required
              </FormErrorMessage>
            )}
          </FormControl>
        </FormControl>
        <FormControl display="flex" flexDirection="column">
          <FormControl isInvalid={isErrorPassword} isRequired>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormLabel style={{ width: "225px" }}>Password</FormLabel>
              <Input
                type={showPassword ? "text" : "password"}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
                style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "8px",
                color: "grey",
              }}
            >
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                style={{
                  marginLeft: "160px",
                  width: "8px",
                  height: "8px",
                }}
              />
              <label style={{ marginLeft: "5px", fontSize: "10px" }}>
                Show Password
              </label>
            </div>
            {!isErrorPassword ? (
              <div style={{ marginBottom: "10px" }}></div>
            ) : (
              <FormErrorMessage
                marginBottom="10px"
                fontSize="10px"
                marginTop="5px"
              >
                <WarningIcon marginRight="5px" marginLeft="150px" />
                Required
              </FormErrorMessage>
            )}
          </FormControl>
        </FormControl>
        <Button style={marginStyle} onClick={() => setSubmitClicked(true)}>
          Login
        </Button>
        <div
          style={{ marginTop: "16px", display: "flex", flexDirection: "row" }}
        >
          <span style={{ marginLeft: "55px" }}>
            Don't have an account? Click here to
          </span>
          <a href="/signup" onClick={() => handleAction("signup")}>
            <Text
              fontSize="md"
              color="#3182CE"
              marginLeft="5px"
              marginRight="55px"
              fontWeight={action === "signup" ? "bold" : ""}
            >
              Sign Up
            </Text>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
