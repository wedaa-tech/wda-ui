import React, { useCallback } from 'react';
import './ContextMenu.css';

export default function ContextMenu({ id, node, top, left, right, bottom, onEditClick, setNodes, setEdges, ...props }) {

    const selectedNode = node;

    const deleteNode = useCallback(() => {
        setNodes(nodes => {
            const filteredNodes = Object.keys(nodes)
                .filter(key => nodes[key].id !== id)
                .reduce((result, key) => {
                    result[key] = nodes[key];
                    return result;
                }, {});
            return { ...structuredClone(filteredNodes) };
        });
        setEdges(edges => {
            const filteredEdges = Object.keys(edges)
                .filter(key => edges[key].source !== id)
                .reduce((result, key) => {
                    result[key] = edges[key];
                    return result;
                }, {});
                return { ...structuredClone(filteredEdges) };
        });
    }, [id, setNodes, setEdges]);

    return (
        <div style={{ top, left, right, bottom }} className="context-menu" {...props}>
            <button onClick={e => onEditClick(e, selectedNode)}>Configure</button>
            <button onClick={deleteNode}>Delete</button>
        </div>
    );
}
