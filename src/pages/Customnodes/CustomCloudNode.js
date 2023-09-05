// import { Handle, Position } from "reactflow";
import azure from "../../assets/Azure.png";
import aws from "../../assets/aws.png";
import minikube from "../../assets/mini.png";

// const handleStyle = { left: 25 };

function CustomCloudNode({ data }) {
  const cloudProvider = data.data.cloudProvider;

  return (
    <div>
      {cloudProvider === "azure" ? (
        <img width="60px" name={cloudProvider} src={azure} alt="azure" />
      ) : cloudProvider === "aws" ? (
        <img width="60px" name={cloudProvider} src={aws} alt="aws" />
      ) : (
        <img width="60px" name={cloudProvider} src={minikube} alt="minikube" />
      )}
    </div>
  );
}

export default CustomCloudNode;
