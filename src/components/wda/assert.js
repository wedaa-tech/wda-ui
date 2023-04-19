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
  applicationType: "Gateway",
  packageName: "com.mycompany.myapp",
  authenticationType: "OAuth2",
  databaseType: "Sql",
  prodDatabaseType: "PostgreSQL",
  clientFramework: "React",
  serviceDiscoveryType: "Eureka",
  serverPort: "9000",
  entities: [],
};
const communicationPreFlightTemplate = {
  clientName:"Client",
  serverName:"Server"
};

const deploymentPreFlightTemplate = {
  deploymentType: "kubernetes",
  dockerRepositoryName: "",
  ingressDomain: "",
  ingressType: "istio",
  kubernetesNamespace: "Wdi",
  kubernetesServiceType: "Ingress",
  kubernetesStorageClassName: "demosc",
  kubernetesUseDynamicStorage: "true",
  serviceDiscoveryType: "eureka",
};

const wdiPreFlightTemplate = {
  domain : "example.com",
  cloudProvider : "aws",
  awsAccountId  : "379605592402", // This is our AWS account ID, has to be passed by the end user. Discard this value later!
  orchestration : "kubernetes",
  awsRegion : "ap-south-1",
  awsAccessKey : "<awsAccessKey>",
  awsSecretKey : "<awsSecretKey>",
  instanceType: "t3.medium",
  clusterName : "demo-cluster",
  ingress: "istio",
  monitoring: "true",
  k8sWebUI:  "true"
};


export {
  entityTuplesPreFlightTemplate,
  entityPreFlightTemplate,
  applicationPreFlightTemplate,
  communicationPreFlightTemplate,
  deploymentPreFlightTemplate,
  wdiPreFlightTemplate
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