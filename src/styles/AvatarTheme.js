import { avatarAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(avatarAnatomy.keys);

const smd = defineStyle({
    width: '40px',
    height: '40px',
});

const sizes = {
    smd: definePartsStyle({ container: smd }),
};

export const avatarTheme = defineMultiStyleConfig({ sizes });
