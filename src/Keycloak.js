import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: process.env.REACT_APP_KEYCLOAK_URL,
  realm: "wda", //defined realm name as Tic
  clientId: "wda", // defined the rootURL(/3000) and client name in (clients->create)
  //redirect_uri:"http://localhost:3000"
});

export default keycloak;
