import React from "react";
import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  FormErrorMessage,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

const centerStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "85vh",
};
const containerStyles = {
  marginTop: "16px",
  textAlign: "center",
};
const headingStyles = {
  fontWeight: "extrabold",
  marginBottom: "4",
  marginBottom: "50px",
};
const marginStyle = {
  marginTop: "16px",
};

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);

  const isErrorFirstName = submitClicked && firstName === "";
  const isErrorLastName = submitClicked && lastName === "";
  const isErrorEmail = submitClicked && email === "";
  const isErrorMobileNumber = submitClicked && mobileNumber === "";
  const isErrorUserName = submitClicked && userName === "";
  const isErrorPassword = submitClicked && password === "";
  const isErrorConfirmPassword = submitClicked && confirmPassword === "";

  return (
    <div style={centerStyles}>
      <div
        style={{
          ...containerStyles,
          border: "1px solid #cfcfcf",
          padding: "60px",
        }}
      >
        <Heading style={headingStyles}>SignUp</Heading>
        <FormControl display="flex" flexDirection="column">
          <FormControl isInvalid={isErrorFirstName} isRequired>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormLabel style={{ width: "225px" }}>First Name</FormLabel>
              <Input
                type="text"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                value={firstName}
                style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
              />
            </div>
            {!isErrorFirstName ? (
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
          <FormControl isInvalid={isErrorLastName} isRequired>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormLabel style={{ width: "225px" }}>Last Name</FormLabel>
              <Input
                type="text"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                value={lastName}
                style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
              />
            </div>
            {!isErrorLastName ? (
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
          <FormControl isInvalid={isErrorEmail} isRequired>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormLabel style={{ width: "225px" }}>Email</FormLabel>
              <Input
                type="text"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
              />
            </div>
            {!isErrorEmail ? (
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
          <FormControl isInvalid={isErrorMobileNumber} isRequired>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormLabel style={{ width: "225px" }}>Mobile Number</FormLabel>
              <Input
                type="number"
                onChange={(e) => {
                  setMobileNumber(e.target.value);
                }}
                value={mobileNumber}
                style={{ border: "1px solid #cfcfcf", boxShadow: "none" }}
              />
            </div>
            {!isErrorMobileNumber ? (
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
        <FormControl display="flex" flexDirection="column">
          <FormControl isInvalid={isErrorConfirmPassword} isRequired>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormLabel style={{ width: "225px" }}>Confirm Password</FormLabel>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                value={confirmPassword}
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
                checked={showConfirmPassword}
                onChange={() => setShowConfirmPassword(!showConfirmPassword)}
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
            {!isErrorConfirmPassword ? (
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
          SignUp
        </Button>
      </div>
    </div>
  );
}

export default SignUp;
