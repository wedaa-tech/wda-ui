import { Handle, Position, NodeResizer } from 'reactflow';
import postgres from '../../assets/postgresql.png';
import sql from '../../assets/mongo.png';

function CustomImageNode({ data, isConnectable, selected }) {
    return (
        <>
            <NodeResizer nodeId={data.id} isVisible={selected} minWidth={100} minHeight={30} />
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {data?.label && data.label.length > 0 ? (
                    <>
                        <img
                            style={{ position: 'absolute', top: 0, left: 0, width: '30px' }}
                            src={data.prodDatabaseType === 'postgresql' ? postgres : sql}
                            alt="database"
                        />
                        <div
                            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '10px' }}
                        >
                            {data.label}
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img width="80px" src={data.prodDatabaseType === 'postgresql' ? postgres : sql} alt="database" />
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

export default CustomImageNode;
