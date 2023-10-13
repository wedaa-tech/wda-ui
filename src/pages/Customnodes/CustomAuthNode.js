import { Handle, Position, NodeResizer } from 'reactflow';
import keycloak from '../../assets/keycloak.png';

// const handleStyle = { left: 25 };

function CustomAuthNode({ data, isConnectable, selected }) {
    const authenticationType = data.authenticationType;

    return (
        <>
            <NodeResizer nodeId={data.id} isVisible={selected} minWidth={100} minHeight={30} />
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {data?.label && data.label.length > 0 ? (
                    <>
                        <img
                            style={{ position: 'absolute', top: 0, left: 0, width: '40px', marginTop: '-6px' }}
                            name={authenticationType}
                            src={keycloak}
                            alt="keycloak"
                        />
                        <div
                            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '10px' }}
                        >
                            {data.label}
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img style={{ width: '72px', marginTop: '-5px' }} name={authenticationType} src={keycloak} alt="keycloak" />
                    </div>
                )}
            </div>
            <Handle position={Position.Left} id="target.Left" type="target" isConnectable={isConnectable} />
            <Handle position={Position.Top} id="target.Top" type="target" isConnectable={isConnectable} />
            <Handle position={Position.Bottom} id="target.Bottom" type="target" isConnectable={isConnectable} />
            <Handle position={Position.Right} id="target.Right" type="target" isConnectable={isConnectable} />
        </>
    );
}

export default CustomAuthNode;
