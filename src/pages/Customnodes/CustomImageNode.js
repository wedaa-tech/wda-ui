import { Handle, Position, NodeResizer } from "reactflow";
import postgres from "../../assets/pstgrc.jpeg";
import sql from "../../assets/mongo.png";

function CustomImageNode({ data, isConnectable, selected }) {
  console.log(data);

  return (
    <>
      <NodeResizer
        nodeId={data.id}
        isVisible={selected}
        minWidth={60}
        minHeight={60}
      />
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <img
          width="60px"
          src={data.prodDatabaseType == "postgresql" ? postgres : sql}
        />
      </div>
    </>
  );
}

export default CustomImageNode;
