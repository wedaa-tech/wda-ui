import { Box, Button, Flex, Link, SimpleGrid, Text } from '@chakra-ui/react';
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
                <Text fontSize={'4xl'} color={'white'} fontWeight={'bold'}>
                    Quickstart your application journey with <span style={{ color: 'hsl(42, 83%, 53%)' }}>WeDAA</span>
                </Text>
                <Text fontSize={'lg'} color={'white'}>
                    Generate complete code on a modern tech stack that’s ready to deploy and run.
                    <br />
                    Build your modern application prototype with WeDAA accelerator.
                </Text>
                <Button
                    div
                    onClick={() => history.push('/canvasToCode')}
                    marginTop={6}
                    background={'hsl(42, 83%, 53%)'}
                    colorScheme="yellow"
                    textColor={'black'}
                    border={'2px solid white'}
                    height={'50px'}
                    size="md"
                >
                    Build Your Own
                </Button>
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
                        return <ReferenceArchCard id={key} archData={archsList[key]} />;
                    })}
                </SimpleGrid>
            </Flex>
        </Flex>
    );
};

export default Wizard;
