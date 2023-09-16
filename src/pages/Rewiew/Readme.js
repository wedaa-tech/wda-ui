import React, { useEffect, useState } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { UI_README, SERVICE_README } from './ReadmeOutputs';

const Readme = ({ nodeType }) => {
    const [readmeData, setReadmeData] = useState('');

    console.log(nodeType, 'readme');

    useEffect(() => {
        if (nodeType && nodeType.includes('Service')) {
            setReadmeData(SERVICE_README);
        } else if (nodeType && nodeType.includes('Gateway')) {
            setReadmeData(UI_README);
        } else if (nodeType && nodeType.includes('UI')) {
            setReadmeData(UI_README);
        } else {
            setReadmeData();
        }
    }, [nodeType]);

    if (nodeType == null) {
        return <div>Please select an Component.</div>;
    } else {
        return <MarkdownPreview wrapperElement={{ 'data-color-mode': 'light' }} source={readmeData} />;
    }
};

export default Readme;
