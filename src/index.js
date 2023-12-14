import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import { buttonTheme } from './styles/ButtonTheme';
import { linkTheme } from './styles/LinkTheme';
import { avatarTheme } from './styles/AvatarTheme';
import '@fontsource/poppins';

export const theme = extendTheme({
    components: {
        Button: buttonTheme,
        Link: linkTheme,
        Avatar: avatarTheme,
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChakraProvider theme={theme}>
        <App />
    </ChakraProvider>,
);
