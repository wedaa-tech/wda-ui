import { Box, Button, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import ReferenceArchCard from './WizardComponents/ReferenceArchCard';
import ArchSelectorComponent from './WizardComponents/ArchSelectorComponent';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import WizardSelection from './WizardSelection';
import { useKeycloak } from '@react-keycloak/web';

const Wizard = () => {
    const history = useHistory();
    const [selectedArch, setSelectedArch] = useState(null);
    const [archsList, setArchsList] = useState([]);
    const { initialized, keycloak } = useKeycloak();
    const archSelectorRef = useRef();
    const handleSelect = arch => {
        history.push({
            pathname: '/wizardselection',
            state: arch,
        });
    };

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
                }
            })
            .catch(error => console.error(error));
        // }
    }, [initialized, keycloak]);

    useEffect(() => {
        if (history.location.hash === '#arch-selection' && archSelectorRef.current) {
            archSelectorRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history.location.hash]);

    return selectedArch ? (
        <WizardSelection sharedSelectedArch={selectedArch} setSharedSelectedArch={setSelectedArch} />
    ) : (
        <Flex className="page">
            <Flex className="background">
                <Text fontSize={'5xl'} color={'white'} fontWeight={'bold'}>
                    Let's prototype with <span style={{ color: 'gold' }}>WeDAA</span>
                </Text>
                <Text color={'white'}>A platform for you to move quicker & easier</Text>
                <Button div marginTop={6} backgroundColor={'white'} colorScheme="whiteAlpha" textColor={'black'} size="md">
                    Know more about WeDAA
                </Button>
            </Flex>
            <Flex paddingBlock={24} className="box">
                <Flex
                    onClick={() => history.push('/wizardselection')}
                    alignItems={'center'}
                    justifyContent={'space-around'}
                    borderLeft={'4px solid #397EF6'}
                    shadow={'lg'}
                    _hover={{
                        shadow: 'xl',
                    }}
                    height={'120px'}
                    width={'30%'}
                    backgroundColor={'white'}
                    roundedRight={10}
                >
                    <Flex id={archSelectorRef} justifyContent={'space-evenly'} flexDir={'column'} gap={2}>
                        <Text fontSize={'xl'} fontWeight={'bold'}>
                            Build Your Own
                        </Text>
                        <Text fontSize={'xs'}>New Project with a tour</Text>
                    </Flex>
                    <svg width="64" height="64" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="64" height="64" rx="32.5" fill="#E7EBFF" />
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M33.75 26.25C33.75 25.5596 33.1904 25 32.5 25C31.8096 25 31.25 25.5596 31.25 26.25V31.25H26.25C25.5596 31.25 25 31.8096 25 32.5C25 33.1904 25.5596 33.75 26.25 33.75H31.25V38.75C31.25 39.4404 31.8096 40 32.5 40C33.1904 40 33.75 39.4404 33.75 38.75V33.75H38.75C39.4404 33.75 40 33.1904 40 32.5C40 31.8096 39.4404 31.25 38.75 31.25H33.75V26.25Z"
                            fill="#422F8A"
                            fill-opacity="0.87"
                        />
                    </svg>
                </Flex>
            </Flex>
            <Flex className="box" alignItems={'flex-start'} gap={6}>
                <Box
                    style={{
                        display: 'flex',
                        width: '1140px',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '20px',
                    }}
                >
                    <Text fontSize={'sm'}>PROTOTYPE CATEGORIES</Text>
                    <Text fontSize={'5xl'} fontWeight={'bold'}>
                        Our Top Picks
                    </Text>
                    <Text fontSize={'sm'}>Find the one you want to work on</Text>
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
            >
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '20px',
                    }}
                >
                    <Text style={{ display: 'flex', alignItems: 'center', gap: '10px', alignSelf: 'stretch' }}>SAMPLES</Text>
                    <Text
                        style={{
                            color: '#0E1E2F',
                            fontFeatureSettings: "'clig' off, 'liga' off",
                            fontSize: '44px',
                            fontStyle: 'normal',
                            fontWeight: '600',
                            lineHeight: '130%',
                        }}
                    >
                        Other Reference Architectures
                    </Text>
                </Box>
                <SimpleGrid
                    columns={3}
                    style={{
                        gap: '60px',
                    }}
                >
                    {Object.keys(archsList).map(key => {
                        return <ReferenceArchCard id={key} archData={archsList[key]} />;
                    })}
                </SimpleGrid>
            </Flex>
        </Flex>
    );
};

export default Wizard;
