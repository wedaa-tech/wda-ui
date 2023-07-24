import docker from "../../assets/docker.png";
import mini from "../../assets/mini.jpeg";

function CustomLocalenvironmentNode({ data, isConnectable }) {
  const Localenvironment = data.Localenvironment;

  return (
    <div>
      {Localenvironment === "docker" ? (
        <img width="60px" name={Localenvironment} src={docker} alt="docker" />
      ) : (
        <img width="60px" name={Localenvironment} src={mini} alt="mini" />
      )}
    </div>
  );
}

export default CustomLocalenvironmentNode;
