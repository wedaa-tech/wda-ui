import { Handle, Position, useStore, NodeResizer } from "reactflow";

const connectionNodeIdSelector = (state) => state.connectionNodeId;

export default function ResizableNode({ id, data, selected }) {
  const connectionNodeId = useStore(connectionNodeIdSelector);

  const isConnecting = !!connectionNodeId;
  const sourceStyle = { zIndex: !isConnecting ? 1 : 0 };

  return (
    <>
      <NodeResizer
        nodeId={data.id}
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <div style={{ textAlign: "center" }}>{data.label}</div>
      <>
        <Handle
          id="source.Right"
          position={Position.Right}
          type="source"
          style={sourceStyle}
        />
        <Handle
          id="source.Bottom"
          position={Position.Bottom}
          type="source"
          style={sourceStyle}
        />
        <Handle
          id="source.Top"
          position={Position.Top}
          type="source"
          style={sourceStyle}
        />
        <Handle
          id="source.Left"
          position={Position.Left}
          type="source"
          style={sourceStyle}
        />
      </>

      <Handle position={Position.Left} id="target.Left" type="target" />
      <Handle position={Position.Top} id="target.Top" type="target" />
      <Handle position={Position.Bottom} id="target.Bottom" type="target" />
      <Handle position={Position.Right} id="target.Right" type="target" />
    </>
  );
}

