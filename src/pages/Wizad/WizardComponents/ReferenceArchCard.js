import { Box, Image, Text } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

const ReferenceArchCard = ({id = null, archData = []}) => {
    return (
        <Box padding={4} className="ref-card" height={288} width={360}>
            <Image rounded={'xl'} maxH={'170px'} flexGrow={1} src={archData.imageUrl} />
            <Box>
                <Text fontWeight={'bold'} fontSize={'lg'}>
                    {archData.name}
                </Text>
                <Text lineHeight={'160%'} color={'#757F87'} fontSize={'sm'}>
                    Stack used <ArrowForwardIcon />
                </Text>
                <Text fontSize={'sm'} fontWeight={'bold'}>
                    Free
                </Text>
            </Box>
        </Box>
    );
};

export default ReferenceArchCard;
