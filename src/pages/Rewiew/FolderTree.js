import React, { useEffect, useState } from 'react';
import { Box, Button, VStack, Stack, Text, Center, Flex, Icon, SimpleGrid, GridItem, Divider } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';

import folderStructure from './folderStructure.json';

// You can customize and extend this structure as per your specific project's folder structure.

const CollapsibleFolder = ({ item, level, onItemClick }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const handleToggleCollapse = () => {
        if (item.type === 'folder') {
            setIsCollapsed(!isCollapsed);
        }
    };

    const renderChildren = children => {
        if (isCollapsed || item.type !== 'folder') return null;

        return (
            <VStack spacing={1} align="start" alignItems={'stretch'}>
                {children.map(child => (
                    <CollapsibleFolder key={child.name} item={child} level={level + 1} onItemClick={onItemClick} />
                ))}
            </VStack>
        );
    };

    return (
        <Stack align="start" spacing={1} alignItems={'stretch'}>
            <Box alignItems="center" paddingLeft={`${level * 10}px`} display={'flex'}>
                {item.type === 'folder' ? (
                    <Icon as={isCollapsed ? ChevronRightIcon : ChevronDownIcon} mr={2} w={4} h={4} />
                ) : (
                    <Box w={4} h={4} mr={2} />
                )}
                <Button
                    colorScheme="blue"
                    variant="ghost"
                    onClick={() => {
                        handleToggleCollapse();
                        onItemClick(item);
                    }}
                    p={2}
                    w="100%"
                    justifyContent="flex-start"
                    textAlign="left"
                    textColor={'black'}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between" w="100%">
                        <Text>{item.name}</Text>
                    </Box>
                </Button>
            </Box>

            {renderChildren(item.children)}
        </Stack>
    );
};

const FolderTree = ({ nodeType }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [folders, setFolders] = useState([]);

    useEffect(() => {
        if (nodeType && nodeType.includes('Service')) {
            setFolders(folderStructure['Service']);
        } else if (nodeType && nodeType.includes('Gateway')) {
            setFolders(folderStructure['Gateway']);
        } else if (nodeType && nodeType.includes('UI')) {
            setFolders(folderStructure['UI']);
        } else {
            setFolders([]);
            setSelectedItem(null);
        }
    }, [nodeType]);

    const handleItemClick = item => {
        setSelectedItem(item);
    };

    if (nodeType == null) {
        return <div>Please select an Component.</div>;
    } else {
        return (
            <SimpleGrid columns={6} spacing={4}>
                <GridItem className="folder-tree" colSpan={3}>
                    <VStack spacing={2} align="start" alignItems={'stretch'}>
                        {folders.map(item => (
                            <CollapsibleFolder key={item.name} item={item} level={0} onItemClick={handleItemClick} />
                        ))}
                    </VStack>
                </GridItem>
                <GridItem colSpan={3}>
                    {/* <Box
            w="100%"
            h="calc(100vh - 200px)"
            border="1px solid"
            borderRadius="10px"
            p={4}
            px={8}
          >
            {selectedItem && (
              <VStack align="start" spacing={2}>
                <Text fontSize="4xl">{selectedItem.name}</Text>
                <Text>Type: {selectedItem.type}</Text>
                <Text>{selectedItem.description}</Text>
              </VStack>
            )}
          </Box> */}
                </GridItem>
            </SimpleGrid>
        );
    }
};

export default FolderTree;
