import { Handle, Position, NodeResizer } from "reactflow";
import postgres from "../../assets/postgresql.png";
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
      <div>
        <img
          width="60px"
          src={data.prodDatabaseType === "postgresql" ? postgres : sql}
          alt="database"
        />
      </div>
      <Handle position={Position.Left} id="target.Left" type="target" isConnectable={isConnectable}/>
      <Handle position={Position.Top} id="target.Top" type="target" isConnectable={isConnectable}/>
      <Handle position={Position.Bottom} id="target.Bottom" type="target" isConnectable={isConnectable}/>
      <Handle position={Position.Right} id="target.Right" type="target" isConnectable={isConnectable}/>
    </>
  );
}

export default CustomImageNode;
