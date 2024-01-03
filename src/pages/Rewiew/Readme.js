import React, { useEffect, useState } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import {
    REACT_README,
    DOCUSAURUS_README,
    ANGULAR_README,
    GOMICRO_README,
    JAVA_README,
    GATEWAY_README,
    GLOBAL_README,
} from './ReadmeOutputs';

const Readme = ({ nodeType, nodeData }) => {
    const [readmeData, setReadmeData] = useState('');
    useEffect(() => {
        if (nodeType && nodeType.includes('Service') && nodeData.applicationFramework.includes('spring')) {
            setReadmeData(JAVA_README(nodeData));
        } else if (nodeType && nodeType.includes('Gateway')) {
            setReadmeData(GATEWAY_README(nodeData));
        } else if (nodeType && nodeType.includes('UI') && nodeData.applicationFramework.includes('react')) {
            setReadmeData(REACT_README(nodeData));
        } else if (nodeType && nodeType.includes('UI') && nodeData.applicationFramework.includes('docusaurus')) {
            setReadmeData(DOCUSAURUS_README(nodeData));
        } else if (nodeType && nodeType.includes('UI') && nodeData.applicationFramework.includes('angular')) {
            setReadmeData(ANGULAR_README(nodeData));
        } else if (nodeType && nodeType.includes('Service') && nodeData.applicationFramework.includes('gomicro')) {
            setReadmeData(GOMICRO_README(nodeData));
        } else {
            setReadmeData(GLOBAL_README());
        }
    }, [nodeType]);

    return <MarkdownPreview wrapperElement={{ 'data-color-mode': 'light' }} source={readmeData} />;
};

export default Readme;
