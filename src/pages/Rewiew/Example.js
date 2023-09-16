export const example = {
  nodes: [
    {
      id: "Service_1",
      type: "ResizableNode",
      position: {
        x: 330,
        y: 160,
      },
      data: {
        label: "Backend",
        applicationName: "Backend",
        applicationFramework: "java",
        packageName: "com.test.backend",
        serverPort: "9000",
        applicationType: "microservice",
        prodDatabaseType: "postgresql",
      },
      style: {
        border: "1px solid black",
        width: "120px",
        height: "40px",
        borderRadius: "15px",
      },
      selected: false,
      positionAbsolute: {
        x: 330,
        y: 160,
      },
      dragging: false,
    },
    {
      id: "UI",
      type: "ResizableNode",
      position: {
        x: 330,
        y: 0,
      },
      data: {
        label: "Frontend",
        applicationName: "Frontend",
        clientFramework: "react",
        packageName: "frontend",
        serverPort: "9001",
        withExample: "false",
        applicationType: "gateway",
      },
      style: {
        border: "1px solid black",
        width: "120px",
        height: "40px",
        borderRadius: "15px",
      },
      selected: false,
      positionAbsolute: {
        x: 330,
        y: 0,
      },
      dragging: false,
    },
    {
      id: "authenticationType",
      type: "selectorNode3",
      position: {
        x: 610,
        y: -10,
      },
      data: {
        authenticationType: "oauth2",
      },
      style: {
        border: "1px solid",
        padding: "4px 4px",
      },
      selected: false,
      positionAbsolute: {
        x: 610,
        y: -10,
      },
      dragging: false,
    },
    {
      id: "Database_1",
      type: "selectorNode",
      position: {
        x: 360,
        y: 320,
      },
      data: {
        prodDatabaseType: "postgresql",
        isConnected: true,
      },
      style: {
        border: "1px solid",
        padding: "4px 4px",
        width: 62,
        height: 62,
      },
      selected: false,
      positionAbsolute: {
        x: 360,
        y: 320,
      },
      dragging: false,
    },
    {
      id: "serviceDiscoveryType",
      type: "selectorNode1",
      position: {
        x: 610,
        y: 150,
      },
      data: {
        serviceDiscoveryType: "eureka",
      },
      style: {
        border: "1px solid",
        padding: "4px 4px",
      },
      selected: false,
      positionAbsolute: {
        x: 610,
        y: 150,
      },
      dragging: false,
    },
    {
      id: "logManagement",
      type: "selectorNode6",
      position: {
        x: 610,
        y: 310,
      },
      data: {
        logManagementType: "eck",
      },
      style: {
        border: "1px solid",
        padding: "4px 4px",
      },
      selected: false,
      positionAbsolute: {
        x: 610,
        y: 310,
      },
      dragging: false,
    },
  ],
  edges: [
    {
      id: "UI-Service_1",
      source: "UI",
      sourceHandle: "source.Bottom",
      target: "Service_1",
      targetHandle: "target.Top",
      markerEnd: {
        color: "#bcbaba",
        type: "arrowclosed",
      },
      type: "smoothstep",
      data: {
        client: "UI",
        server: "Service_1",
        type: "asynchronous",
        framework: "rabbitmq",
      },
      style: {
        stroke: "#bcbaba",
      },
      selected: false,
      label: "RabbitMQ",
    },
    {
      id: "Service_1-Database_1",
      source: "Service_1",
      sourceHandle: "source.Bottom",
      target: "Database_1",
      targetHandle: null,
      markerEnd: {
        color: "black",
        type: "arrowclosed",
      },
      type: "smoothstep",
      data: {},
      style: {
        stroke: "black",
      },
    },
  ],
};
