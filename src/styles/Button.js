import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const brandPrimary = defineStyle({
    // background: 'linear-gradient(101deg, hsl(228, 66%, 53%), hsl(228, 66%, 47%))',
    // display: 'inline-block',
    // // color: '#fff',
    // padding: '14px 28px',
    // borderRadius: '.5rem',
    // fontSize: 'var(--normal-font-size)',
    // fontWeight: 'var(--font-medium)',
    // boxShadow: '0 4px 8px hsla(228, 66%, 45%, .25)',
    // transition: '.3s',
    // cursor: 'pointer',
});

export const buttonTheme = defineStyleConfig({
    variants: { brandPrimary },
    defaultProps: {
        size: 'lg',
        // variant: 'brandPrimary',
        colorScheme: 'blue',
    },
});
