import eck from "../../assets/eck.png";
import { NodeResizer } from "reactflow";

// const handleStyle = { left: 25 };

function CustomLoadNode({ data, selected }) {
  const logManagementType = data.logManagementType;

  return (
    <>
      <NodeResizer
        nodeId={data.id}
        isVisible={selected}
        minWidth={60}
        minHeight={30}
      />
      <div>
        <img width="60px" name={logManagementType} src={eck} />
      </div>
    </>
  );
}

export default CustomLoadNode;
