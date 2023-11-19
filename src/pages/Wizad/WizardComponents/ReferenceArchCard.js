import { Box, Image, Text } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import imagetest from '../../../assets/85ba684ecb48e373ee3e18204e789164.png'; // Replace with your image path

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
