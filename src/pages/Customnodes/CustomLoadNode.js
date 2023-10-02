import eck from '../../assets/eck.png';
import { NodeResizer } from 'reactflow';

// const handleStyle = { left: 25 };

function CustomLoadNode({ data, selected }) {
    const logManagementType = data.logManagementType;

    return (
        <>
            <NodeResizer nodeId={data.id} isVisible={selected} minWidth={100} minHeight={30} />
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {data?.label && data.label.length > 0 ? (
                    <>
                        <img
                            style={{ position: 'absolute', top: 0, left: 0, width: '30px',marginTop:'-3px' }}
                            name={logManagementType}
                            src={eck}
                            alt="eck"
                        />
                        <div
                            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '10px' }}
                        >
                            {data.label}
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img width="60px" name={logManagementType} src={eck} alt="eck" />
                    </div>
                )}
            </div>
        </>
    );
}

export default CustomLoadNode;
