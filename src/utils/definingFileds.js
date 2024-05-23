// import UiData from '../components/Modal/ApplicationModal';

const colors = ['#ffc9c9', '#b2f2bb', '#a5d8ff', '#ffec99', '#fff'];
const UiFields = [
    { key: 'label', label: 'Label', placeholder: 'Display Name', maxLength: 32, error: '' },
    { key: 'applicationName', label: 'Component Name', placeholder: 'Component Name', maxLength: 32, error: '' },
    { key: 'theme', label: 'Theme', placeholder: 'Select a Theme', options: ['Default', 'Profile'], error: '' },
    { key: 'serverPort', label: 'Server Port', placeholder: 'Port number', maxLength: 5, error: '' },
    { key: 'description', label: 'Description', placeholder: 'A small description', maxLength: 45, error: '' },
];
const GatewayFields = [
    { key: 'label', label: 'Label', placeholder: 'Display Name', maxLength: 32, error: '' },
    { key: 'applicationName', label: 'Component Name', placeholder: 'Component Name', maxLength: 32, error: '' },
    { key: 'packageName', label: 'Package Name', placeholder: 'com.example', maxLength: 32, error: '' },
    { key: 'serverPort', label: 'Server Port', placeholder: 'Port number', maxLength: 5, error: '' },
];
const ServiceFields = [
    { key: 'label', label: 'Label', placeholder: 'Display Name', maxLength: 32, error: '' },
    { key: 'applicationName', label: 'Component Name', placeholder: 'Component Name', maxLength: 32, error: '' },
    { key: 'packageName', label: 'Package Name', placeholder: 'com.example', maxLength: 32, error: '' },
    { key: 'serverPort', label: 'Server Port', placeholder: 'Port number', maxLength: 5, error: '' },
];
const GroupFields = [{ key: 'label', label: 'Name', placeholder: 'Display Name', maxLength: 32, error: '' }];
const ServiceDescriptionField = [
    { key: 'description', label: 'Description', placeholder: 'A small description about your service', error: '' },
];

export { colors, UiFields, GatewayFields, ServiceFields, GroupFields, ServiceDescriptionField };
