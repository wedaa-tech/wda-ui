import React from 'react';
import { Handle, Position, useStore, NodeResizer } from 'reactflow';
import srv1 from '../../assets/spring.png';
import srv2 from '../../assets/go.png';
import ui1 from '../../assets/react.png';
import ui2 from '../../assets/angular.png';
import gateway from '../../assets/cloud gateway.png';
import docs from '../../assets/docusaurus.png';

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

    const nodeType = useStore(s => {
        const node = s.nodeInternals.get(id);
        var appFramework = node.data?.applicationFramework;
        if (node.id.startsWith('Gateway')) appFramework = 'gateway';
        return appFramework;
    });
    const resizedImage = () => {
        console.log(nodeType);
        switch (nodeType) {
            case 'spring':
                return (
                    <img
                        style={{ position: 'absolute', top: 0, left: '3px', width: '30px', marginTop: '-1px' }}
                        name={nodeType}
                        src={srv1}
                        alt={nodeType}
                    />
                );
            case 'gomicro':
                return (
                    <img
                        style={{ position: 'absolute', top: 0, left: '2px', width: '22px', marginTop: '-4px' }}
                        name={nodeType}
                        src={srv2}
                        alt={nodeType}
                    />
                );
            case 'react':
                return (
                    <img
                        style={{ position: 'absolute', top: 0, left: '3px', width: '30px', marginTop: '-1px' }}
                        name={nodeType}
                        src={ui1}
                        alt={nodeType}
                    />
                );
            case 'angular':
                return (
                    <img
                        style={{ position: 'absolute', top: 0, left: '5px', width: '30px', marginTop: '-1px' }}
                        name={nodeType}
                        src={ui2}
                        alt={nodeType}
                    />
                );
            case 'gateway':
                return (
                    <img
                        style={{ position: 'absolute', top: 0, left: '4px', width: '30px', marginTop: '2px' }}
                        name={nodeType}
                        src={gateway}
                        alt={nodeType}
                    />
                );
            case 'docusaurus':
                return (
                    <img
                        style={{ position: 'absolute', top: 0, left: '-3px', width: '35px', marginTop: '-1px' }}
                        name={nodeType}
                        src={docs}
                        alt={nodeType}
                    />
                );
            default:
                return (
                    <img
                        style={{ position: 'absolute', top: 0, left: '3px', width: '30px', marginTop: '-1px' }}
                        name={nodeType}
                        src={srv1}
                        alt={nodeType}
                    />
                );
        }
    };

    const enlargedImage = () => {
        console.log(nodeType);
        switch (nodeType) {
            case 'spring':
                return (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img style={{ width: '72px', marginTop: '-1px' }} name={nodeType} src={srv1} alt={nodeType} />
                    </div>
                );
            case 'gomicro':
                return (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img style={{ width: '65px', marginTop: '-2px', marginLeft: '-12px' }} name={nodeType} src={srv2} alt={nodeType} />
                    </div>
                );
            case 'react':
                return (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img style={{ width: '65px', marginTop: '-1px' }} name={nodeType} src={ui1} alt={nodeType} />
                    </div>
                );
            case 'angular':
                return (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img style={{ width: '72px', marginTop: '-1px' }} name={nodeType} src={ui2} alt={nodeType} />
                    </div>
                );
            case 'gateway':
                return (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img style={{ width: '82px', marginTop: '2px' }} name={nodeType} src={gateway} alt={nodeType} />
                    </div>
                );
            case 'docusaurus':
                return (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img style={{ width: '70px', marginTop: '2px' }} name={nodeType} src={docs} alt={nodeType} />
                    </div>
                );
            default:
                return (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img style={{ width: '72px', marginTop: '-1px' }} name={nodeType} src={srv1} alt={nodeType} />
                    </div>
                );
        }
    };
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
        if (!inputString) return 40;
        const length = inputString.length;
        return length * 10 + 30;
    }

    const lengthstr = maxLength(data.label);
    const labeledWithSpaces = () => {
        if (!data?.label) return enlargedImage();
        return data.label.split('').map((char, index) =>
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
    };

    return (
        <>
            <NodeResizer nodeId={data.id} isVisible={selected} minHeight={40} minWidth={40} />
            {data?.label && resizedImage()}
            <div style={{ padding: 10, textAlign: 'center', lineHeight: 1.2 }}>{labeledWithSpaces()}</div>
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
