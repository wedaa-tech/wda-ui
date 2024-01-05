export function GLOBAL_README() {
    return `
  Please select a Component for more information. Refer to the component level README's for component level details.`;
}

export function DOCUSAURUS_README(nodeData) {
    return `# ${nodeData.applicationName} prototype

  This is a docusaurus application prototype, generated using WeDAA. You can find documentation and help at -
  - [WeDAA Docs](https://www.wedaa.tech/docs/introduction/what-is-wedaa/)
  - [Docusaurus Docs](https://docusaurus.io/docs/category/guides)
  
  ## Prerequisites
  
  - Node version >= 18
  - npm version >= 9.6
  
  ## Project Structure
  
  This is a standard Docusaurus application, hence it follows same project structure.
  
  \`\`\`
  ├── blog (Blogs in Markdown files)
  ├── docs (Docs in Markdown files)
  ├── src (React pages)
  ├── static (static assets like images, videos, etc)
  ├── README.md
  ├── docusaurus.config.js (docusaurus project configurations)
  ├── package.json
  └── sidebars.js (Sidebar configuration)
  \`\`\`
  
  ## Get Started
  
  In the terminal, run the following command to install all the required dependencies for the Docusaurus documentation site:
  
  \`\`\`bash
  npm install && npm run build
  \`\`\`
  
  After the dependencies are installed, start the local development server using the following command:
  \`\`\`bash
  npm run serve
  \`\`\`
  
  Once the server is up and running, open your web browser and visit http://localhost:${nodeData.serverPort}/ to see the locally running Docusaurus documentation site.`;
}

export function REACT_README(nodeData) {
    return `# ${nodeData.applicationName} prototype

This is a react application prototype, generated using WeDAA. You can find documentation and help at [WeDAA Docs](https://www.wedaa.tech/docs/introduction/what-is-wedaa/)

## Prerequisites

- Node version >= 18
- npm version >= 9.6
- docker version >= 24

## Project Structure

This project is based on standard React Application, so it follows the same project structure.

\`\`\`
├── public/
├── docker/ (contains docker compose files for external components based on architecture design)
├── src
    ├── App.css
    ├── App.js (Main React Component)
    ├── assets/ (Static files)
    ├── components/ (react application components)
    ├── config/ (contains integration code for other components)
├── Dockerfile (for packaging the application as docker image)
├── README.md (Project documentation)
├── comm.yo-rc.json (generator configuration file for communications)
├── nginx.conf (nginx server configuration)
└── package.json (npm configuration)
\`\`\`

## Dependencies

This application is configured to work with few external components if selected.

Docker compose files are provided for the same to get started quickly.

Component details:

- Keycloak as Identity Management:

  Run keycloak as docker container: 
  \`\`\`bash
  docker compose -f docker/keycloak.yml up -d 
  \`\`\`

On launch, react application will refuse to start if it is not able to connect to any of the above component(s).

## Get Started

Install required dependencies: 
\`\`\`bash
npm install
\`\`\`

Run the prototype locally in development mode: 
\`\`\`bash
npm start
\`\`\`

Open [http://localhost:${nodeData.serverPort}](http://localhost:${nodeData.serverPort}) to view it in your browser.


The page will reload when you make changes.

## Containerization

Build the docker image: 
\`\`\`bash
docker build -t ${nodeData.applicationName}:latest  
\`\`\`

Start the container: 
\`\`\`bash
docker run -d -p ${nodeData.serverPort}:80 ${nodeData.applicationName}:latest
\`\`\`

  `;
}

export function ANGULAR_README(nodeData) {
    console.log('hii12345');
    return `# ${nodeData.applicationName} prototype

This is an angular application prototype, generated using WeDAA. You can find documentation and help at [WeDAA Docs](https://www.wedaa.tech/docs/introduction/what-is-wedaa/)

## Prerequisites

- Node version >= 18
- npm version >= 9.6
- docker version >= 24

## Project Structure

This project is based on standard Angular Application, so it follows the same project structure.

\`\`\`
├── docker/ (contains docker compose files for external components based on architecture design)
├── src
│   ├── app
│   │   ├── auth (Authentication component If selected)
│   │   ├── home (Homepage component)
│   │   ├── layouts (Navbar component)
│   │   ├── app-routing.module.ts
│   │   ├── app.component.css
│   │   ├── app.component.html
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── assets
│   │   └── logox.png
│   ├── favicon.ico
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── README.md (Project documentation)
├── angular.json (Angular configuration)
├── comm.yo-rc.json (generator configuration file for communications)
├── environment.production.ts (Production environment configuration)
├── environment.ts (Development environment configuration)
├── package.json (npm configuration)
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
\`\`\`

## Dependencies

This application is configured to work with few external components.

Docker compose files are provided for the same to get started quickly.

Component details:
- Keycloak as Identity Management - 
\`\`\`bash 
docker compose -f docker/keycloak.yml up -d
\`\`\`

On launch, ${nodeData.applicationName} will refuse to start if it is not able to connect to any of the above component(s).

## Get Started

Install required dependencies: 
\`\`\`bash 
npm install
\`\`\`

Run the prototype locally in development mode: 
\`\`\`bash 
npm start
\`\`\` 


Open [http://localhost:${nodeData.serverPort}](http://localhost:${nodeData.serverPort}) to view it in your browser.

The page will reload when you make changes.

## Containerization

Build the docker image: \`\`\`bash docker build -t ${nodeData.applicationName}:latest .\`\`\`

Start the container: \`\`\`bash docker run -d -p ${nodeData.serverPort}:80 ${nodeData.applicationName}:latest\`\`\`

  `;
}

export function GOMICRO_README(nodeData) {
    return `# ${nodeData.applicationName} prototype

  This is a go-micro prototype generated using WeDAA, you can find documentation and help at [WeDAA Docs](https://www.wedaa.tech/docs/introduction/what-is-wedaa/)
  
  ## Prerequisites
  
  - go version >= 1.20
  
  ## Project Structure
  
  \`\`\`
  ├── auth/ (IdP configuration for keycloak if selected)
  ├── config/ (configuration properties loader)
  ├── controllers/ (api controllers)
  ├── db/ (DB connection configuration)
  ├── docker/ (contains docker compose files for external components based on architecture design)
  ├── eurekaregistry/ (configuration for eureka service registry)
  ├── handler/ (DB handler methods)
  ├── migrate/ (database schema change management)
  ├── proto/ (proto files supporting DB models)
  ├── rabbitmq/ (message broker configuration)
  ├── resources/ (configuration properties)
  ├── Dockerfile (for packaging the application as docker image)
  ├── README.md (Project documentation)
  ├── comm.yo-rc.json (generator configuration file for communications)
  ├── go.mod
  └── main.go
  \`\`\`
    
  ## Dependencies
  
  This application is configured to work with external component(s).
  
  Docker compose files are provided for the same to get started quickly.
  
  Component details:
  
  Keycloak as Identity Management: 
  \`\`\`bash 
  docker compose -f docker/keycloak.yml up -d
  \`\`\`  
  Eureka Service Discovery: 
  \`\`\`bash 
  docker compose -f docker/jhipster-registry.yml up -d
  \`\`\`
  Postgresql DB: 
  \`\`\`bash 
  docker compose -f docker/postgresql.yml up -d
  \`\`\`
  mongoDB: 
  \`\`\`bash 
  docker compose -f docker/mongodb.yml up -d
  \`\`\`
  - RabbitMQ message broker: 
  \`\`\`bash 
  docker compose -f docker/rabbitmq.yml up -d
  \`\`\`
  
  On launch, ${nodeData.applicationName} will refuse to start if it is not able to connect to any of the above component(s).
  
  ## Get Started
  
  Install required dependencies:   
  \`\`\`bash 
  go mod tidy 
  \`\`\`
  
  Run the prototype locally:  
  \`\`\`bash 
  go run .
  \`\`\`
  
  Open [http://localhost:${nodeData.serverPort}/hello](http://localhost:${nodeData.serverPort}/hello) to view it in your browser.
  
  The page will reload when you make changes.
  
  ## Containerization
  
  Build the docker image: 
  \`\`\`bash
  docker build -t ${nodeData.applicationName}:latest .
  \`\`\`
  
  Start the container: 
  \`\`\`bash
  docker run -d -p ${nodeData.serverPort}:${nodeData.serverPort} ${nodeData.applicationName}:latest
  \`\`\`
  `;
}

export function SPRING_README(nodeData) {
    return `
  # ${nodeData.applicationName} prototype

This is a microservice prototype generated using WeDAA, you can find documentation and help at [WeDAA Docs](https://www.wedaa.tech/docs/introduction/what-is-wedaa/)

## Prerequisites

- jdk version >= 17

## Project Structure

\`\`\`
├── src/
    ├── main/
        ├── docker (contains docker compose files for external components based on architecture design)
        ├── java/${nodeData.applicationName}/
        └──  resources  (configuration properties)
    └── test/ (testcases for prototype)
        ├── java/${nodeData.applicationName}/
        └──  resources
├── target/
├── checkstyle.xml
├── comm.yo-rc.json (generator configuration file for communications)
├── COMMUNICATION.md (Communication documentation)
├── mvnw
├── mvnw.cmd
├── package.json
├── pom.xml
├── README.md (Project documentation)
└── sonar-project.properties
\`\`\`

## Dependencies

This application is configured to work with external component(s).

Docker compose files are provided for the same to get started quickly.

Component details:

Keycloak as Identity Management: 
 \`\`\`bash 
 npm run docker:keycloak:up
 \`\`\`
Eureka Service Discovery: 
\`\`\`bash 
npm run docker:jhispter-registry:up 
\`\`\`
Database: 
\`\`\`bash 
npm run docker:db:up
\`\`\`
RabbitMQ message broker: 
\`\`\`bash 
npm run docker:rabbitmq:up
\`\`\`

On launch, ${nodeData.applicationName} will refuse to start if it is not able to connect to any of the above component(s).

## Get Started

The below cmd will install the required dependencies and run the prototype in local machine.

Run the prototype locally: 
\`\`\`bash 
./mvnw
\`\`\`

Open [http://localhost:${nodeData.serverPort}/management/health/readiness](http://localhost:${nodeData.serverPort}/management/health/readiness) to view it in your browser.

You could see the below response in your browser:
\`\`\`
{
  "status": "UP"
}
\`\`\` 

## Containerization

Docker image will be built with the prototype name.

Build the docker image: 
\`\`\`bash 
npm run java:docker
\`\`\`

Start the container: 
\`\`\`bash 
docker run -d -p ${nodeData.serverPort}:${nodeData.serverPort} ${nodeData.applicationName}:latest
\`\`\`

  `;
}

export function GATEWAY_README(nodeData) {
    return `
# ${nodeData.applicationName} prototype

This is a gateway prototype generated using WeDAA, you can find documentation and help at [WeDAA Docs](https://www.wedaa.tech/docs/introduction/what-is-wedaa/)

## Prerequisites

- jdk version >= 17

## Project Structure

\`\`\`
├── src/
  ├── main/
      ├── docker (contains docker compose files for external components based on architecture design)
      ├── java/${nodeData.applicationName}/
      └──  resources  (configuration properties)
  └── test/ (testcases for prototype)
      ├── java/${nodeData.applicationName}/
      └──  resources
├── target/
├── checkstyle.xml
├── comm.yo-rc.json (generator configuration file for communications)
├── COMMUNICATION.md (Communication documentation)
├── mvnw
├── mvnw.cmd
├── package.json
├── pom.xml
├── README.md (Project documentation)
└── sonar-project.properties
\`\`\`

## Dependencies

This application is configured to work with external component(s).

Docker compose files are provided for the same to get started quickly.

Component details:

Keycloak as Identity Management: 
\`\`\`bash 
npm run docker:keycloak:up
\`\`\`
Eureka Service Discovery: 
\`\`\`bash 
npm run docker:jhispter-registry:up 
\`\`\`
Database: 
\`\`\`bash 
npm run docker:db:up
\`\`\`
RabbitMQ message broker: 
\`\`\`bash 
npm run docker:rabbitmq:up
\`\`\`

On launch, ${nodeData.applicationName} will refuse to start if it is not able to connect to any of the above component(s).

## Get Started

The below cmd will install the required dependencies and run the prototype in local machine.

Run the prototype locally: 
\`\`\`bash 
./mvnw
\`\`\`

Open [http://localhost:${nodeData.serverPort}/management/health/readiness](http://localhost:${nodeData.serverPort}/management/health/readiness) to view it in your browser.

You could see the below response in your browser:
\`\`\`
{
  "status": "UP"
}
\`\`\` 

## Containerization

Docker image will be built with the prototype name.

Build the docker image: 
\`\`\`bash 
npm run java:docker
\`\`\`

Start the container: 
\`\`\`bash 
docker run -d -p ${nodeData.serverPort}:${nodeData.serverPort} ${nodeData.applicationName}:latest
\`\`\`

`;
}
