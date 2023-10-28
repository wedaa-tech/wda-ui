import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import { buttonTheme } from './styles/Button';
import "@fontsource/poppins"; 

export const theme = extendTheme({
    components: {
        Button: buttonTheme,
        fonts: {
            heading: `'Poppins', sans-serif`,
            body: `'Poppins', sans-serif`,
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChakraProvider theme={theme}>
        <App />
    </ChakraProvider>,
);
