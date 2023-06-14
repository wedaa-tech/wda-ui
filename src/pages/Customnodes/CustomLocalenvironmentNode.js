import docker from "../../assets/docker.png"
import mini from "../../assets/mini.jpeg"


function CustomLocalenvironmentNode({ data, isConnectable }) {

  const Localenvironment= data.Localenvironment

  return (
      <div>
        {Localenvironment === 'docker' ?
          <img width='60px' name={Localenvironment} src={docker} /> :
          <img width='60px' name={Localenvironment} src={mini} />
        }
    </div>
  );
}

export default CustomLocalenvironmentNode;