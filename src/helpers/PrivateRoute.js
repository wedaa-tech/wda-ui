import { useKeycloak } from "@react-keycloak/web";
import { useHistory } from "react-router-dom";

const PrivateRoute = ({ children }) => {
const { keycloak } = useKeycloak();
const history = useHistory();

const isLoggedIn = keycloak.authenticated;

if (!isLoggedIn) {
alert("Please login to continue.");
history.replace("/");
return null;
}

return children;
};

export default PrivateRoute;