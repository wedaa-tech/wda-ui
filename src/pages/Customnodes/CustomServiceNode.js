import eureka from '../../assets/eureka.png';
import { NodeResizer } from 'reactflow';
// import consol from "../../assets/consol.png";

function CustomServiceNode({ data, isConnectable, selected }) {
    const serviceDiscoveryType = data.serviceDiscoveryType;

    return (
        <>
            {/* <div style={{ height: '40px', padding: '4px', border: '1px solid #1a192b', borderRadius: '15px', marginBottom: '10px' }}> */}
            <NodeResizer nodeId={data.id} isVisible={selected} minWidth={100} minHeight={30} />
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {data?.label && data.label.length > 0 ? (
                    <>
                        <img
                            style={{ position: 'absolute', top: 0, left: 0, width: '15px' }}
                            name={serviceDiscoveryType}
                            src={eureka}
                            alt="eureka"
                        />
                        <div
                            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '10px' }}
                        >
                            {data.label}
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img width="40px" name={serviceDiscoveryType} src={eureka} alt="eureka" />
                    </div>
                )}
            </div>
            {/* </div> */}
        </>
    );
}

export default CustomServiceNode;
