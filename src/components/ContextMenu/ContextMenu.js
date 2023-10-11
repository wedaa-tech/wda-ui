import React, { useCallback } from 'react';
import { useReactFlow } from 'reactflow';
import './style.css';

export default function ContextMenu({ id, node, top, left, right, bottom, onEditClick, ...props }) {
    const { setNodes, setEdges } = useReactFlow();

    const selectedNode = node;

    const deleteNode = useCallback(() => {
        setNodes(nodes => {
            const filteredNodes = nodes.filter(nd => nd.id !== id);
            return [...structuredClone(filteredNodes)];
        });
        setEdges(edges => edges.filter(ed => ed.source !== id));
    }, [id, setNodes, setEdges]);

    return (
        <div style={{ top, left, right, bottom }} className="context-menu" {...props}>
            <button onClick={e => onEditClick(e, selectedNode)}>Configure</button>
            <button onClick={deleteNode}>Delete</button>
        </div>
    );
}
