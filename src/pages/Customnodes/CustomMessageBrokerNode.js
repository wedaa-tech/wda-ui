// import { Handle, Position } from "reactflow";
import kafka from "../../assets/kafka.png";
import pulsar from "../../assets/pulsar.png";
import rabbitmq from "../../assets/rabbitmq.png";

// const handleStyle = { left: 25 };

function CustomMessageBrokerNode({ data, isConnectable }) {
  const messageBroker = data.messageBroker;

  return (
    <div>
      {/* <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      /> */}
      <div>
        {messageBroker === "Kafka" ? (
          <img width="50px" name={messageBroker} src={kafka} alt="kafka" />
        ) : messageBroker === "Pulsar" ? (
          <img width="50px" name={messageBroker} src={pulsar} alt="pulsar" />
        ) : (
          <img
            width="50px"
            name={messageBroker}
            src={rabbitmq}
            alt="rabbitmq"
          />
        )}
      </div>
      {/* <Handle
        type="source"
        position={Position.Bottom}
        style={handleStyle}
        isConnectable={isConnectable}
      /> */}
    </div>
  );
}

export default CustomMessageBrokerNode;
