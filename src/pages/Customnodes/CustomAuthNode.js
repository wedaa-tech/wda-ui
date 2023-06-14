import { Handle, Position } from "reactflow";
import keycloak from "../../assets/keycloak.png";

const handleStyle = { left: 25 };

function CustomAuthNode({ data, isConnectable }) {
  const authenticationType = data.authenticationType;

  return (
    <div>
      <img width="60px" name={authenticationType} src={keycloak} />
    </div>
  );
}

export default CustomAuthNode;
