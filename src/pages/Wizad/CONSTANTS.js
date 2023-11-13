import react from '../../assets/react.png';
import angular from '../../assets/angular.png';
import springboot from '../../assets/spring.png';
import gomicro from '../../assets/go.png';
import postgres from '../../assets/postgresql.png';
import mongo from '../../assets/mongo-db.png';
import eck from '../../assets/eck.png';
import keycloak from '../../assets/keycloak.png';
import eureka from '../../assets/eureka.png';
import none from '../../assets/none-icon.jpg';

export const componentsMapping = {
    fullStack: 'Full Stack',
    headless: 'Headless',
    spa: 'Static Web Page',
    profilePage: 'Personal Profile Page',
    react: 'React',
    angular: 'Angular',
    spring: 'Spring Boot',
    gomicro: 'Go Micro',
    postgresql: 'PostgreSQL',
    mongodb: 'MongoDB',
    keycloak: 'KeyCloak',
    eureka: 'Spring Cloud Gateway',
    eck: 'Elastic Cloud on Kubernetes (ECK)',
    skip: 'Not Selected',
};

export const imageMappings = {
    react: react,
    angular: angular,
    spring: springboot,
    gomicro: gomicro,
    postgresql: postgres,
    mongodb: mongo,
    eck: eck,
    keycloak: keycloak,
    eureka: eureka,
    skip: none,
};

export const questionsData = {
    ArchList: {
        question: 'Select The scope of your Application',
        id: 'AT',
        type: 'radio',
        options: {
            fullStack: ['frontend', 'backend', 'database', 'authentication', 'serviceDiscovery', 'logManagement'],
            headless: ['backend', 'authentication', 'serviceDiscovery', 'logManagement'],
            spa: ['frontend', 'authentication', 'logManagement'],
            profilePage: ['frontend'],
        },
    },
    questionsList: {
        frontend: {
            question: 'Select a frontend framework',
            id: 'frontend',
            type: 'radio',
            options: ['react', 'angular'],
        },
        backend: {
            question: 'Select a backend technology Stack',
            id: 'backend',
            type: 'radio',
            options: ['spring', 'gomicro'],
        },
        database: {
            question: 'Select Database Management System',
            id: 'database',
            type: 'radio',
            options: ['postgresql', 'mongodb'],
        },
        authentication: {
            question: 'Select Authentication and Authorization',
            id: 'authentication',
            type: 'radio',
            options: ['keycloak', 'skip'],
        },
        serviceDiscovery: {
            question: 'Select Service Discovery',
            id: 'serviceDiscovery',
            type: 'radio',
            options: ['eureka', 'skip'],
        },
        logManagement: {
            question: 'Select Log Management and observability',
            id: 'logManagement',
            type: 'radio',
            options: ['eck', 'skip'],
        },
    },
};

export const idMappings = {
    AT: 'Application Type',
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Database',
    authentication: 'Authentication',
    serviceDiscovery: 'Service Discovery',
    logManagement: 'Log Management',
};
