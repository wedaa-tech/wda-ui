import eureka from "../../assets/eureka.jpg";
// import consol from "../../assets/consol.png";

function CustomServiceNode({ data, isConnectable }) {
  const serviceDiscoveryType = data.serviceDiscoveryType;

  return (
    <div>
      <img width="50px" name={serviceDiscoveryType} src={eureka} alt='eureka' />
    </div>
  );
}

export default CustomServiceNode;
