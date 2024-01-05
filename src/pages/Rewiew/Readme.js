import React, { useEffect, useState } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import {
    REACT_README,
    DOCUSAURUS_README,
    ANGULAR_README,
    GOMICRO_README,
    SPRING_README,
    GATEWAY_README,
    GLOBAL_README,
} from './ReadmeOutputs';

const Readme = ({ nodeType, nodeData }) => {
    const [readmeData, setReadmeData] = useState('');
 
    const readmeMappings = {
        'Service:spring': SPRING_README,
        'Gateway:java': GATEWAY_README,
        'UI:react': REACT_README,
        'UI:docusaurus': DOCUSAURUS_README,
        'UI:angular': ANGULAR_README,
        'Service:gomicro': GOMICRO_README,
        'default': GLOBAL_README,
    };

    useEffect(() => {
        if (nodeData) {
            const key = `${nodeType.split('_')[0]}:${nodeData.applicationFramework}`;
            const readmeFunction = readmeMappings[key] || readmeMappings['default'];
            setReadmeData(readmeFunction(nodeData));
        }
    }, [nodeType, nodeData]);

    return <MarkdownPreview wrapperElement={{ 'data-color-mode': 'light' }} source={readmeData} />;
};

export default Readme;
