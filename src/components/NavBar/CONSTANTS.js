import { Box1, DocumentSketch, CardEdit, Flash, Graph, Home2, Chart2, Setting3 } from 'iconsax-react';

export const menuData = {
    Home: {
        icon: <Home2 />,
        path: '/',
    },
    MyPrototypes: {
        icon: <DocumentSketch />,
        login: true,
        path: '/prototypes',
    },
    RefArch: {
        icon: <CardEdit />,
        admin: true,
        path: '/architectures',
    },
    Canvas: {
        icon: <Graph />,
        expandable: {
            Quickstart: { icon: <Flash />, path: '/wizardselection' },
            Advanced: { icon: <Setting3 />, path: '/canvastocode' },
        },
    },
    Docs: {
        icon: <Box1 />,
        external: true,
        path: 'https://www.wedaa.tech/docs/introduction/what-is-wedaa/',
    },
    'Feedback Dashboard': {
        icon: <Chart2 />,
        admin: true,
        path: '/feedbacks',
    },
};
