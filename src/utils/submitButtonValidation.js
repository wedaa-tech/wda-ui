const checkNodeExists = (nodes) => {
    return Object.values(nodes).some(
        node => node.id.startsWith('Service') || node.id.startsWith('Gateway') || node.id.startsWith('UI'),
    );
};

const projectNameCheck = (projectName) => {
    return !/^[a-zA-Z](?:[a-zA-Z0-9_ -]*[a-zA-Z0-9])? *$/.test(projectName);
};

const duplicateArchitectureNameCheck = (currentProjectName,projectNames,defaultProjectName) => {
   console.log(defaultProjectName,"default",currentProjectName)
    if(currentProjectName == defaultProjectName)
        return false;
    return  projectNames.includes(currentProjectName);
}

const isDatabaseConnectedAndFilled = (nodes) => {
    let dbConnected = false;
    let dbFilled = false;

    for (const key in nodes) {
        let databaseCheck = nodes[key];
        if (databaseCheck?.id?.startsWith('Database')) {
            if (!databaseCheck?.data?.isConnected) {
                dbConnected = true;
            }
            if (!databaseCheck?.data?.databasePort) {
                dbFilled = true;
            }
        }
        if (dbConnected && dbFilled) {
            break;
        }
    }

    return { isConnected: dbConnected, isFilled: dbFilled };
};

const checkEdge = (edges, nodes) => {
    let updatedEdges = { ...edges };
    let updatedNodes = { ...nodes };
    if (Object.keys(updatedNodes).length !== 0) {
        for (const key in updatedNodes) {
            let databaseCheck = updatedNodes[key];
            if (databaseCheck?.id?.startsWith('Database') && !databaseCheck?.data?.isConnected) {
                return true;
            }
        }
    }
    if (Object.keys(updatedEdges).length !== 0) {
        for (const key in updatedEdges) {
            let edgeCheck = updatedEdges[key];
            if (edgeCheck?.target?.startsWith('Service') && edgeCheck?.source?.startsWith('Service') && !edgeCheck?.data?.framework) {
                return true;
            }
        }
        return false;
    }
};

const checkDisabled = (projectName, isEmptyUiSubmit, isEmptyServiceSubmit, isEmptyGatewaySubmit, nodes, edges,projectNames,authenticated,defaultProjectName) => {
    const databaseStatus = isDatabaseConnectedAndFilled(nodes);

    if (!checkNodeExists(nodes)) {
        return { isValid: false, message: 'Drag and drop atleast one Application to generate the code' };
    }

    if (!projectName || projectNameCheck(projectName)) {
        return { isValid: false, message: 'Architecture name should be valid.' };
    }

    if (projectName === '') {
        return { isValid: false, message: 'Architecture name is empty.' };
    }

    if(authenticated && duplicateArchitectureNameCheck(projectName,projectNames,defaultProjectName)){
        return {isValid:false, message:'Architecture name already exists. Please Change.'}
    }

    if (isEmptyUiSubmit) {
        return { isValid: false, message: 'UI is not Configured. Click on the highlighted UI Node to Configure it.' };
    }

    if (isEmptyServiceSubmit) {
        return { isValid: false, message: 'Service is not Configured. Click on the highlighted Service node to Configure it.' };
    }

    if (isEmptyGatewaySubmit) {
        return { isValid: false, message: 'Gateway is not Configured. Click on the highlighted Gateway node to Configure it.' };
    }

    if (databaseStatus.isConnected) {
        return { isValid: false, message: 'Create an edge connecting the node to Database to enable the integration.' };
    }
    
    if (databaseStatus.isFilled) {
        return { isValid: false, message: 'Database is not Configured. Click on the highlighted Database node to Configure it.' };
    }

    if (checkEdge(edges, nodes)) {
        return{isValid: false, message: 'Fill in the edge connected between the services.'};
    }

    return { isValid: true, message: 'Validation successful. Proceed to generate the application code.' };
};

export { checkNodeExists, projectNameCheck, isDatabaseConnectedAndFilled, checkEdge, checkDisabled };
