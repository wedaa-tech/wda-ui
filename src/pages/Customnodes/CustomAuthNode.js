import { NodeResizer } from "reactflow";
import keycloak from "../../assets/keycloak.png";

// const handleStyle = { left: 25 };

function CustomAuthNode({ data, isConnectable, selected }) {
  const authenticationType = data.authenticationType;

  return (
    <>
      <NodeResizer
        nodeId={data.id}
        isVisible={selected}
        minWidth={60}
        minHeight={30}
      />
      <div>
        <img
          width="60px"
          name={authenticationType}
          src={keycloak}
          alt="keycloak"
        />
      </div>
    </>
  );
}

export default CustomAuthNode;
