import { Box, Image, Text } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const ReferenceArchCard = ({ id = null, archData = [] }) => {
    const history = useHistory();

    return (
        <Box
            cursor={'pointer'}
            onClick={() =>
                history.push({
                    pathname: '/canvastocode',
                    state: { metadata: structuredClone(archData.metadata) },
                })
            }
            padding={4}
            className="ref-card"
            height={288}
            width={360}
        >
            <Image rounded={'xl'} maxH={'170px'} flexGrow={1} src={archData.imageUrl} />
            <Box>
                <Text fontWeight={'bold'} fontSize={'lg'}>
                    {archData.name}
                </Text>
            </Box>
        </Box>
    );
};

export default ReferenceArchCard;
