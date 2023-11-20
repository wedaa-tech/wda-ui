import React from 'react';
import { Panel, useReactFlow, getRectOfNodes, getTransformForBounds } from 'reactflow';
import { toPng } from 'html-to-image';
import { IconButton, Icon } from '@chakra-ui/react';
import { FiDownload } from 'react-icons/fi';

function downloadImage(dataUrl, imageName) {
    const a = document.createElement('a');
    a.setAttribute('download', imageName);
    a.setAttribute('href', dataUrl);
    a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

function DownloadButton(applicationName) {
    const { getNodes } = useReactFlow();

    const onClick = () => {
        var projectName = JSON.parse(localStorage.data).projectName || applicationName?.applicationName || 'wedaa-prototype';
        const nodesList = getNodes();
        if (nodesList.length === 0) {
            return;
        }
        const nodesBounds = getRectOfNodes(nodesList);
        const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);

        toPng(document.querySelector('.react-flow__viewport'), {
            backgroundColor: '#ffffff',
            width: imageWidth,
            height: imageHeight,
            style: {
                width: imageWidth,
                height: imageHeight,
                transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
            },
        }).then(dataUrl => downloadImage(dataUrl, `${projectName}.png`));
    };

    return <IconButton icon={<Icon as={FiDownload} />} size="md" onClick={onClick} />;
}

export default DownloadButton;
