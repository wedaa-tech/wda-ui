import React, { useEffect, useState } from 'react';
import { Text, Box, Flex, Grid, Image } from '@chakra-ui/react';
import './style.css';
import { keyframes } from '@emotion/react';
import { animationsList, defailtsTipsList } from './CONSTANTS';

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export const Testimonial = ({ title, description, idx, image }) => {
    const base64data = btoa(unescape(encodeURIComponent(image)));
    const { start, end, zindex } = animationsList[idx];
    const bounce = keyframes`
        0% {
            top: ${start.top};
            left: ${start.left};
            transform: scale(${start.scale});
        }

        100% {
            top: ${end.top};
            left: ${end.left};
            transform: scale(${end.scale});
        }
`;

    return (
        <Flex
            className="testimonial"
            backgroundColor="#ffff"
            borderRadius="20px"
            boxShadow="-8px 40px 40px #000000cc"
            height="262px"
            width="545px"
            top={end.top}
            left={end.left}
            transform={`scale(${end.scale})`}
            px={16}
            py={4}
            gap={4}
            justifyContent={'center'}
            pos={'absolute'}
            zIndex={zindex}
            animation={`${bounce} 3s normal forwards`}
            flexDir={'column'}
        >
            <Flex className="review-area" gap={4} flexDirection="row" alignItems={'center'}>
                <Image src={`data:image/svg+xml;base64,${base64data}`}  height="70px" width="70px" />
                <Text className="review-title" color="#000000" fontSize={26} fontWeight="700" letterSpacing="0" lineHeight="normal">
                    {title}
                </Text>
            </Flex>
            <Text
                fontFamily="Open Sans-Bold, Helvetica"
                className="revire-desc"
                color="#1a1b1d"
                fontSize={22}
                fontWeight="medium"
                letterSpacing="wider"
                lineHeight="normal"
                width="359px"
                flexGrow={1}
            >
                {/* <span className="span">&lt;&lt; </span> */}
                {description}
                {/* <span className="span"> &gt;&gt;</span> */}
            </Text>

            <Flex className="random-image" flexDir={'row'} gap={'10px'}>
                <Flex justifyContent={'center'} flexDir={'column'} gap={'1px'}></Flex>
                <Text
                    flexGrow={1}
                    className="user-details"
                    color="#b9b9b9"
                    fontFamily="Open Sans-SemiBold"
                    fontSize="16px"
                    fontWeight="600"
                    letterSpacing="0"
                    lineHeight="normal"
                ></Text>
            </Flex>
        </Flex>
    );
};

const Generating = ({ generatingData }) => {
    const [tipsList, setTipsList] = useState(defailtsTipsList);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        // setLoading(true);
        fetch('https://app.wedaa.tech:3001/tips', {
            // fetch(process.env.REACT_APP_API_BASE_URL + '/tips', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(result => {
                setTipsList(shuffleArray(result));
                // setLoading(true);
            })
            .catch(error => console.error(error));
        // setLoading(false);
    }, []);

    return (
        <Box height={'100%'} backgroundColor="#000">
            {tipsList.map((ele, idx) => {
                return <Testimonial title={ele.title} description={ele.description} image={ele.image} idx={idx} />;
            })}
            <Grid h={'100%'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} justifyItems={'center'}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="#f9a000" />
                    <circle
                        transform-origin="center"
                        fill="none"
                        opacity="1"
                        stroke="#ffe5b7a3"
                        stroke-width="18"
                        stroke-linecap="round"
                        cx="100"
                        cy="100"
                        r="50"
                    ></circle>
                    <circle
                        transform-origin="center"
                        fill="none"
                        stroke="white"
                        stroke-width="18"
                        stroke-linecap="round"
                        stroke-dasharray="60 300"
                        stroke-dashoffset="0"
                        cx="100"
                        cy="100"
                        r="50"
                    >
                        <animateTransform
                            type="rotate"
                            attributeName="transform"
                            calcMode="spline"
                            dur="2"
                            values="360;0"
                            keyTimes="0;1"
                            keySplines="0 0 1 1"
                            repeatCount="indefinite"
                        ></animateTransform>
                    </circle>
                </svg>

                <Text className="prototyping loading">PROTOTYPING...</Text>
            </Grid>
            <Flex flexDir={'column'} position={'fixed'} bottom={20} right={20} color={'white'}>
                <Text fontSize={'20px'} fontWeight={'bold'} color={'white'}>
                    Know more about <span style={{ color: 'hsl(42, 83%, 53%)' }}>WeDAA</span> <br />
                    while your code is being generated...
                </Text>
            </Flex>
        </Box>
    );
};

export default Generating;
