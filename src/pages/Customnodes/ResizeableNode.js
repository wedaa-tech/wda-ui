import { memo } from "react";
import { Handle, Position, NodeResizer } from "reactflow";

const ResizableNode = ({ data, selected }) => {
  return (
    <>
      <NodeResizer
        nodeId={data.id}
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <Handle type="target" position={Position.Top} />
      <div style={{ textAlign: "center" }}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default memo(ResizableNode);
