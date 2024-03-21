import { Box1, DocumentSketch, CardEdit, Flash, Graph, Home2, Chart2, Setting3 } from 'iconsax-react';
import { LuSparkle } from "react-icons/lu";
export const menuData = {
    Home: {
        icon: <Home2 />,
        path: '/',
    },
    Prototypes: {
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
            'AI Wizard': {icon: <LuSparkle size={24}/>,path: '/aiwizard'},
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
