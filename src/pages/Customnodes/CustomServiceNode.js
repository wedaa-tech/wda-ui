import eureka from "../../assets/eureka.png";
import { NodeResizer } from "reactflow";
// import consol from "../../assets/consol.png";

function CustomServiceNode({ data, isConnectable, selected }) {
  const serviceDiscoveryType = data.serviceDiscoveryType;

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
          width="50px"
          name={serviceDiscoveryType}
          src={eureka}
          alt="eureka"
        />
      </div>
    </>
  );
}

export default CustomServiceNode;
