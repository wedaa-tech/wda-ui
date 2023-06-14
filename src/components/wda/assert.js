const entityTuplesPreFlightTemplate = {
  tupleName: "Enter Attribute",
  tupleType: "String",
};

const entityPreFlightTemplate = {
  0: entityTuplesPreFlightTemplate,
  entityName: "",
};

const applicationPreFlightTemplate = {
  applicationName: "",
  applicationFramework: "java",
  applicationType: "microservice",
  packageName: "",
  authenticationType: "oauth2",
  databaseType: "sql",
  prodDatabaseType: "postgreSQL",
  clientFramework: "react",
  serviceDiscoveryType: "eureka",
  messageBroker: "no",
  serverPort: "",
  entities: [],
  withExample: "false",
};
const communicationPreFlightTemplate = {
  clientName: "",
  serverName: "",
};

const deploymentPreFlightTemplate = {
  deploymentType: "kubernetes",
  dockerRepositoryName: "",
  ingressDomain: "",
  ingressType: "istio",
  kubernetesNamespace: "",
  kubernetesServiceType: "Ingress",
  kubernetesStorageClassName: "",
  kubernetesUseDynamicStorage: "true",
  serviceDiscoveryType: "eureka",
};

const wdiPreFlightTemplate = {
  domain: "",
  cloudProvider: "aws",
  awsAccountId: "", // This is our AWS account ID, has to be passed by the end user. Discard this value later!
  orchestration: "kubernetes",
  awsRegion: "ap-south-1",
  awsAccessKey: "<awsAccessKey>",
  awsSecretKey: "<awsSecretKey>",
  instanceType: "t3.medium",
  clusterName: "",
  ingress: "istio",
  monitoring: "true",
  enableECK: "true",
  k8sWebUI: "true",
};

export {
  entityTuplesPreFlightTemplate,
  entityPreFlightTemplate,
  applicationPreFlightTemplate,
  communicationPreFlightTemplate,
  deploymentPreFlightTemplate,
  wdiPreFlightTemplate,
};

// {
//   "0": {

//       "tupleType": "BigDecimal",
//       "tupleName": "asdf"
//   },
//   "1": {
//       "tupleName": "Enter Attribute",
//       "tupleType": "String",
//       "required": "false"
//   }
// }
