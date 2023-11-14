import React from 'react';
import { Panel, useReactFlow, getRectOfNodes, getTransformForBounds } from 'reactflow';
import { toPng } from 'html-to-image';
import { IconButton, Icon } from '@chakra-ui/react';
import { FiDownload } from 'react-icons/fi';

function downloadImage(dataUrl) {
    const a = document.createElement('a');

    a.setAttribute('download', 'reactflow.png');
    a.setAttribute('href', dataUrl);
    a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

function DownloadButton() {
    const { getNodes } = useReactFlow();

    const onClick = () => {
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
        }).then(downloadImage);
    };

    return <IconButton icon={<Icon as={FiDownload} />} size="md" onClick={onClick} />;
}

export default DownloadButton;
