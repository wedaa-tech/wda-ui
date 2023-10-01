import React from 'react';
import { Handle, Position, useStore, NodeResizer } from 'reactflow';

const connectionNodeIdSelector = state => state.connectionNodeId;

export default function ResizableNode({ id, data, selected }) {
    // To fetch the height and width of node
    const size = useStore(s => {
        const node = s.nodeInternals.get(id);
        return {
            width: node.width,
            height: node.height,
        };
    });

    const boxStyle = {
        display: 'inline-block',
        width: '10px',
        height: '10px',
    };

    const charStyle = {
        padding: size.width <= 40 ? '7px' : '0px',
    };

    const connectionNodeId = useStore(connectionNodeIdSelector);

    const isConnecting = !!connectionNodeId;
    const sourceStyle = { zIndex: !isConnecting ? 1 : 0 };

    function maxLength(inputString) {
        const length = inputString.length;
        return length * 10 + 30;
    }

    const lengthstr = maxLength(data.label);
    const labeledWithSpaces = data.label.split('').map((char, index) =>
        char === ' ' ? (
            <>
                {size.width <= 40 && (
                    <>
                        <br key={`${index}-br`} /> <div key={index} style={boxStyle}></div>
                    </>
                )}
                {size.width > lengthstr && <div key={index} style={boxStyle}></div>}
                {size.width <= lengthstr && <br key={`${index}-br`} />}
            </>
        ) : (
            <span key={index} style={charStyle}>
                {char}
            </span>
        ),
    );

    return (
        <>
            <NodeResizer nodeId={data.id} isVisible={selected} minHeight={40} minWidth={40} />
            <div style={{ padding: 10, textAlign: 'center', lineHeight: 1.2 }}>{labeledWithSpaces}</div>
            <>
                <Handle id="source.Right" position={Position.Right} type="source" style={sourceStyle} />
                <Handle id="source.Bottom" position={Position.Bottom} type="source" style={sourceStyle} />
                <Handle id="source.Top" position={Position.Top} type="source" style={sourceStyle} />
                <Handle id="source.Left" position={Position.Left} type="source" style={sourceStyle} />
            </>

            <Handle position={Position.Left} id="target.Left" type="target" />
            <Handle position={Position.Top} id="target.Top" type="target" />
            <Handle position={Position.Bottom} id="target.Bottom" type="target" />
            <Handle position={Position.Right} id="target.Right" type="target" />
        </>
    );
}
