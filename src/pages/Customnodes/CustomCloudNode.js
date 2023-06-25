import { Handle, Position } from "reactflow";
import azure from "../../assets/Azure.png";
import aws from "../../assets/aws.png";
import minikube from "../../assets/mini.jpeg";

const handleStyle = { left: 25 };

function CustomCloudNode({ data, isConnectable }) {
  const cloudProvider = data.data.cloudProvider;

  return (
    <div>
      {cloudProvider === "azure" ? (
        <img width="60px" name={cloudProvider} src={azure} />
      ) : cloudProvider === "aws" ? (
        <img width="60px" name={cloudProvider} src={aws} />
      ) : (
        <img width="60px" name={cloudProvider} src={minikube} />
      )}
    </div>
  );
}

export default CustomCloudNode;
