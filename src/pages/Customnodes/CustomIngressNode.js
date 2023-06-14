import { Handle, Position } from "reactflow";
import istio from "../../assets/istio.png";
import consol from "../../assets/consol.png";

const handleStyle = { left: 25 };

function CustomIngressNode({ data, isConnectable }) {
  const Ingress_Type = data.Ingress_Type;

  return (
    <div>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <img width="50px" name={Ingress_Type} src={istio} />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={handleStyle}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default CustomIngressNode;
