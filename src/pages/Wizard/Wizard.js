import { Box, Button, Flex, IconButton, Link, SimpleGrid, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import './Wizard.css';
import ReferenceArchCard from './WizardComponents/ReferenceArchCard';
import ArchSelectorComponent from './WizardComponents/ArchSelectorComponent';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import WizardSelection from './WizardSelection';
import { useKeycloak } from '@react-keycloak/web';
import { ArrowCircleDown2, ArrowDown } from 'iconsax-react';

const Wizard = () => {
    const history = useHistory();
    const [selectedArch, setSelectedArch] = useState(null);
    const [scrollHide, setScrollHide] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [archsList, setArchsList] = useState([]);
    const { initialized, keycloak } = useKeycloak();
    const archSelectorRef = useRef();
    const handleSelect = arch => {
        history.push({
            pathname: '/wizardselection',
            state: arch,
        });
    };

    const isBottom = el => {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    };

    useEffect(() => {
        const trackScrolling = () => {
            const wrappedElement = document.getElementById('container');
            console.log(isBottom(wrappedElement), wrappedElement);
            if (isBottom(wrappedElement)) {
                setScrollHide(true);
            } else {
                setScrollHide(false);
            }
        };
        document.addEventListener('scroll', trackScrolling);
        return () => document.removeEventListener('scroll', trackScrolling);
    }, [scrollHide]);

    useEffect(() => {
        // if (initialized) {
        fetch(process.env.REACT_APP_API_BASE_URL + '/refArchs', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
            },
        })
            .then(response => response.json())
            .then(result => {
                if (result?.data) {
                    const archs = structuredClone(result.data);
                    const publishedArchitectures = archs.filter(card => card.published === true);
                    setArchsList(publishedArchitectures);
                    setIsLoaded(true);
                }
            })
            .catch(error => console.error(error));
        // }
    }, [initialized, keycloak]);

    useEffect(() => {
        if (history.location.hash === '#arch-selection' && archSelectorRef.current) {
            archSelectorRef.current.scrollIntoView({ behavior: 'smooth' });
            setScrollHide(true);
        }
    }, [history.location.hash]);

    return selectedArch ? (
        <WizardSelection sharedSelectedArch={selectedArch} setSharedSelectedArch={setSelectedArch} />
    ) : (
        <>
            <Flex className="page" id="container">
                <Flex className="background" flexDirection="column">
                    <Text fontSize={'3xl'} color={'white'} fontWeight={'bold'} marginBottom={'2'}>
                        Quickstart your application journey with <span style={{ color: 'hsl(42, 83%, 53%)' }}>WeDAA</span>
                    </Text>
                    <Text fontSize={'lg'} color={'white'} fontWeight={'bold'} marginBottom={'2'}>
                        Accelerates your path to modernizing and building enterprise applications.
                    </Text>
                    <Text fontSize={'lg'} color={'white'} fontWeight={'bold'} marginBottom={'2'}>
                        WeDAA AI platform helps you to:
                    </Text>
                    {/* <Text fontSize={'s'} color={'white'} textAlign={"left"}>
                        <br />
                        <div style={{height:'200px',width:'200px',backgroundColor:':'}}></div> */}
                    {/* <span style={{fontWeight:550,paddingLeft:'250px'}}>Design:</span> Cloud native enterprise applications with comprehensive architecture.  */}
                    {/* <br />
                        <span style={{fontWeight:550,paddingLeft:'250px'}}>Generate:</span> Fully functional application along with code. 
                        <br />
                        <span style={{fontWeight:550,paddingLeft:'250px'}}>Deploy & Run:</span> Scripts to run application in local or deploy to cloud infrastructure.
                        <br />
                        <span style={{fontWeight:550,paddingLeft:'250px'}}>Manage:</span> Continuous Integration and Delivery of generated application.
                    </Text> */}

                    <Flex marginTop={9} marginBottom={12} justifyContent={'center'}>
                        <div className="line line-three">
                            <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 160 200 Q 200 40 300 80 Q 400 120 360 120 L 360 120 L 360 200" />
                            </svg>
                        </div>

                        <div className="line line-two">
                            <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 120 80 L 140 80 Q 210 20 300 80 Q 390 140 360 200" />
                            </svg>
                        </div>

                        <div className="circle-container" id="first-circle">
                            <div className="circle" style={{ background: "linear-gradient(90deg, #00008B, #8A2BE2"}}>
                                <span>Design</span>
                            </div>
                            <div className="line line-one">
                                <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M 120 80 Q 160 400 500 80" />
                                </svg>
                            </div>
                            <div className="content" style={{marginTop:"35px"}}>Cloud native enterprise applications with comprehensive architecture.</div>
                        </div>
                        <div className="circle-container" id="second-circle">
                            <div className="content">Fully functional application along with code.</div>
                            <div className="circle home-bottom" style={{background: 'linear-gradient(90deg, #006400, #32CD32)'}}>
                                <span>Generate</span>
                            </div>
                        </div>
                        <div className="line line-four">
                            <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 880 80 L 880 80 Q 780 40 700 80 Q 620 120 640 120" />
                            </svg>
                        </div>
                        <div className="circle-container" id="third-circle">
                            <div className="circle " style={{background: 'linear-gradient(90deg, #8B0000, #DC143C)'}}>
                                <span>Deploy & Run</span>
                            </div>
                            <div className="content" style={{marginTop:"35px"}}>Scripts to run application in local or deploy to cloud infrastructure.</div>
                        </div>
                        <div className="line line-five">
                            <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 840 200 Q 800 40 700 80 Q 600 120 640 120 L 640 120 L 640 200" />
                            </svg>
                        </div>

                        <div className="circle-container" id="fourth-circle">
                            <div className="content">Continuous Integration and Delivery of generated application.</div>
                            <div className="circle home-bottom" style={{background: 'linear-gradient(90deg, #FF4500, #FFD700)'}}>
                                <span>Manage</span>
                            </div>
                        </div>
                    </Flex>

                    <Flex marginTop={6} justifyContent={'center'}>
                        <Button
                            div
                            onClick={() => history.push('/canvasToCode')}
                            background={'hsl(42, 83%, 53%)'}
                            colorScheme="yellow"
                            textColor={'black'}
                            border={'2px solid white'}
                            height={'50px'}
                            size="md"
                            marginRight={10}
                            zIndex={2}
                        >
                            Build Your Own
                        </Button>
                        <Button
                            div
                            onClick={() => history.push('/aiwizard')}
                            background={'hsl(42, 83%, 53%)'}
                            colorScheme="yellow"
                            textColor={'black'}
                            border={'2px solid white'}
                            height={'50px'}
                            size="md"
                            zIndex={2}
                        >
                            AI Wizard
                        </Button>
                    </Flex>
                </Flex>
                <Flex paddingTop={12} className="box" alignItems={'flex-start'} gap={6}>
                    <Box
                        style={{
                            display: 'flex',
                            width: '1140px',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '20px',
                        }}
                    >
                        <Text fontSize={'4xl'} fontWeight={'bold'}>
                            Quickstart with App Wizard
                        </Text>
                    </Box>
                    <Flex
                        style={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'space-between',
                            gap: '40px',
                        }}
                    >
                        <ArchSelectorComponent samples={3} value="fullStack" setSelectedArch={handleSelect} />

                        <ArchSelectorComponent samples={2} value="headless" setSelectedArch={handleSelect} />

                        <ArchSelectorComponent samples={6} value="spa" setSelectedArch={handleSelect} />

                        <ArchSelectorComponent samples={1} value="personalWebsite" setSelectedArch={handleSelect} />
                    </Flex>
                </Flex>
                <Flex
                    style={{
                        display: 'flex',
                        width: '1200px',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        gap: '60px',
                        paddingBlock: '120px',
                    }}
                    ref={archSelectorRef}
                >
                    <Box
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '20px',
                        }}
                    >
                        <Text
                            style={{
                                color: '#0E1E2F',
                                fontFeatureSettings: "'clig' off, 'liga' off",
                                fontSize: '2.25rem',
                                fontStyle: 'normal',
                                fontWeight: '600',
                                lineHeight: '130%',
                            }}
                        >
                            Reference Architectures
                        </Text>
                    </Box>
                    <SimpleGrid
                        columns={3}
                        style={{
                            gap: '60px',
                        }}
                    >
                        {Object.keys(archsList).map(key => {
                            return <ReferenceArchCard id={key} archData={archsList[key]} isLoaded={isLoaded} />;
                        })}
                    </SimpleGrid>
                </Flex>
            </Flex>
            <IconButton
                variant="ghost"
                position={'fixed'}
                backgroundColor={'#ffffff00'}
                colorScheme="gold"
                aria-label="Scroll Down"
                isRound={true}
                bottom={8}
                display={scrollHide ? 'none' : 'inline-flex'}
                right={8}
                isLoading={!isLoaded}
                onClick={() => {
                    archSelectorRef.current.scrollIntoView({ behavior: 'smooth' });
                    setScrollHide(true);
                }}
                icon={<ArrowCircleDown2 size="48" color="#ebaf24" variant="Bulk" />}
            />
        </>
    );
};

export default Wizard;
